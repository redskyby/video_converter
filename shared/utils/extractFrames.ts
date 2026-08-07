import { ExtractFramesProps } from '@/shared/interfaces/ExtractFramesProps';
import { Frame } from '@/shared/types/Frame';
import { cleanupVideoResources } from '@/shared/utils/cleanupVideoResources';

export const extractFrames = async ({ file, frameCount, signal }: ExtractFramesProps): Promise<Frame[]> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const frames: Frame[] = [];

        // Сохраняем URL, чтобы его можно было очистить
        const videoUrl = URL.createObjectURL(file);
        video.src = videoUrl;
        video.muted = true;
        video.playsInline = true;

        signal?.addEventListener('abort', () => {
            cleanupVideoResources(videoUrl, frames, video);
            resolve([]);
        });

        video.onloadedmetadata = async () => {
            const duration = video.duration;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            for (let i = 0; i < frameCount; i++) {
                if (signal?.aborted) {
                    cleanupVideoResources(videoUrl, frames, video);
                    resolve([]);
                    return;
                }

                const time = (duration / frameCount) * i;
                video.currentTime = time;

                await new Promise<void>((res) => {
                    video.onseeked = () => {
                        if (signal?.aborted) {
                            res();
                            return;
                        }

                        ctx?.drawImage(video, 0, 0);

                        canvas.toBlob(
                            (blob) => {
                                if (blob && !signal?.aborted) {
                                    const url = URL.createObjectURL(blob);
                                    frames.push({ url, time });
                                }
                                res();
                            },
                            'image/jpeg',
                            0.5,
                        );
                    };
                });
            }

            // Очищаем URL самого видеофайла после того, как все кадры извлечены
            URL.revokeObjectURL(videoUrl);

            resolve(frames);
        };

        video.onerror = () => {
            cleanupVideoResources(videoUrl, frames, video);
            resolve([]);
        };
    });
};
