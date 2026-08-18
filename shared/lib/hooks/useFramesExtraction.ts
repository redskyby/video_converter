import { useEffect, useRef, useState } from 'react';

import { Frame } from '@/shared/types/Frame';
import { extractFrames } from '@/shared/utils/extractFrames';

export const useFramesExtraction = (file: File | null, frameCount: number) => {
    const [frames, setFrames] = useState<Frame[]>([]);
    const [loading, setLoading] = useState(false);

    const frameUrlsRef = useRef<string[]>([]);

    useEffect(() => {
        if (!file) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFrames([]);

            frameUrlsRef.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });

            frameUrlsRef.current = [];

            return;
        }

        const controller = new AbortController();

        const processVideo = async () => {
            try {
                setLoading(true);

                const extractedFrames = await extractFrames({
                    file,
                    frameCount,
                    signal: controller.signal,
                });

                // Если extraction закончился после abort
                if (controller.signal.aborted) {
                    extractedFrames.forEach((frame) => {
                        URL.revokeObjectURL(frame.url);
                    });

                    return;
                }

                // Освобождаем предыдущие кадры
                frameUrlsRef.current.forEach((url) => {
                    URL.revokeObjectURL(url);
                });

                // Сохраняем новые URL
                frameUrlsRef.current = extractedFrames.map((frame) => frame.url);

                setFrames(extractedFrames);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Ошибка при извлечении кадров:', error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        processVideo();

        return () => {
            controller.abort();
        };
    }, [file, frameCount]);

    // Финальный cleanup при unmount
    useEffect(() => {
        return () => {
            frameUrlsRef.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });

            frameUrlsRef.current = [];
        };
    }, []);

    return {
        frames,
        loading,
    };
};
