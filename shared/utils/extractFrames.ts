import { ExtractFramesProps } from '@/shared/interfaces/ExtractFramesProps';
import { Frame } from '@/shared/types/Frame';

export const extractFrames = async ({ file, frameCount, signal }: ExtractFramesProps): Promise<Frame[]> => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const frames: Frame[] = [];
    const videoUrl = URL.createObjectURL(file);

    const revokeFrames = () => {
        frames.forEach((frame) => {
            URL.revokeObjectURL(frame.url);
        });

        frames.length = 0;
    };

    try {
        video.src = videoUrl;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';

        await new Promise<void>((resolve, reject) => {
            if (signal?.aborted) {
                reject(new DOMException('Aborted', 'AbortError'));
                return;
            }

            const onAbort = () => {
                reject(new DOMException('Aborted', 'AbortError'));
            };

            signal?.addEventListener('abort', onAbort, { once: true });

            video.onloadedmetadata = () => {
                signal?.removeEventListener('abort', onAbort);

                resolve();
            };

            video.onerror = () => {
                signal?.removeEventListener('abort', onAbort);

                reject(new Error('Failed to load video'));
            };
        });

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        for (let i = 0; i < frameCount; i++) {
            if (signal?.aborted) {
                revokeFrames();
                return [];
            }

            const time = (video.duration / frameCount) * i;

            video.currentTime = time;

            await new Promise<void>((resolve, reject) => {
                const onAbort = () => {
                    reject(new DOMException('Aborted', 'AbortError'));
                };

                signal?.addEventListener('abort', onAbort, { once: true });

                video.onseeked = () => {
                    signal?.removeEventListener('abort', onAbort);

                    if (signal?.aborted) {
                        reject(new DOMException('Aborted', 'AbortError'));
                        return;
                    }

                    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob || signal?.aborted) {
                                resolve();
                                return;
                            }

                            const url = URL.createObjectURL(blob);

                            frames.push({
                                url,
                                time,
                            });

                            resolve();
                        },
                        'image/jpeg',
                        0.5,
                    );
                };
            });
        }

        return frames;
    } catch (error) {
        revokeFrames();

        if (error instanceof DOMException && error.name === 'AbortError') {
            return [];
        }

        throw error;
    } finally {
        video.onloadedmetadata = null;
        video.onerror = null;
        video.onseeked = null;

        video.pause();
        video.removeAttribute('src');
        video.load();

        URL.revokeObjectURL(videoUrl);
    }
};
