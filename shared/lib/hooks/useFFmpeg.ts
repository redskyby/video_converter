import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { useEffect, useRef, useState } from 'react';

import { detectPlatform } from '@/shared/utils/detectPlatform';
import { getFFmpegBaseURL } from '@/shared/utils/getFFmpegBaseURL';

export const useFFmpeg = () => {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const ffmpeg = new FFmpeg();
                ffmpegRef.current = ffmpeg;

                ffmpeg.on('progress', ({ progress: ratio }) => {
                    setProgress(Math.round(ratio * 100));
                });
                //
                // ffmpeg.on('log', ({ message }) => {
                //     console.log(message);
                // });

                // Определяем платформу и выбираем соответствующий базовый URL
                const platform = detectPlatform();
                const baseURL = getFFmpegBaseURL(platform);

                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
                });

                setIsLoading(false);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке FFmpeg';
                console.error('❌ Ошибка загрузки FFmpeg:', errorMessage);
                setError(errorMessage);
                setIsLoading(false);
            }
        };

        load();

        return () => {
            ffmpegRef.current?.terminate();
            ffmpegRef.current = null;
        };
    }, []);

    return { ffmpegRef, isLoading, progress, error, setProgress };
};
