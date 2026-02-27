import { Frame } from '@/types';

export const extractFrames = async (file: File, frameCount: number): Promise<Frame[]> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const frames: Frame[] = [];

        video.src = URL.createObjectURL(file);
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

            resolve(frames);
        };
    });
};
