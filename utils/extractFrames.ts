import { Frame } from '@/types';

export const extractFrames = async (file: File, frameCount: number): Promise<Frame[]> => {
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

        video.onloadedmetadata = async () => {
            const duration = video.duration;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            for (let i = 0; i < frameCount; i++) {
                const time = (duration / frameCount) * i;
                video.currentTime = time;

                await new Promise((res) => {
                    video.onseeked = () => {
                        ctx?.drawImage(video, 0, 0);
                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    const url = URL.createObjectURL(blob);
                                    frames.push({ url, time });
                                }
                                res(null);
                            },
                            'image/jpeg',
                            0.6,
                        );
                    };
                });
            }

            // 👇 Очищаем URL самого видеофайла после того, как все кадры извлечены
            URL.revokeObjectURL(videoUrl);

            resolve(frames);
        };

        video.onerror = () => {
            // Также очищаем в случае ошибки
            URL.revokeObjectURL(videoUrl);
            resolve([]); // или reject, в зависимости от желаемой обработки ошибок
        };
    });
};
