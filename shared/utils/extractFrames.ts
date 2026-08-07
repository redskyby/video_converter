import { ExtractFramesProps } from '@/shared/interfaces/ExtractFramesProps';
import { Frame } from '@/shared/types/Frame';

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

        const cleanup = () => {
            URL.revokeObjectURL(videoUrl);

            frames.forEach((frame) => {
                URL.revokeObjectURL(frame.url);
            });

            video.pause();

            video.onloadedmetadata = null;
            video.onseeked = null;
            video.onerror = null;
        };

        signal?.addEventListener('abort', () => {
            cleanup();
            resolve([]);
        });

        video.onloadedmetadata = async () => {
            const duration = video.duration;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            for (let i = 0; i < frameCount; i++) {
                if (signal?.aborted) {
                    cleanup();
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
            cleanup();
            resolve([]);
        };
    });
};
