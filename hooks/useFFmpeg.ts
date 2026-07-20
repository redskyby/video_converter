import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { useEffect, useRef, useState } from 'react';

import { detectPlatform } from '@/utils/detectPlatform';
import { getFFmpegBaseURL } from '@/utils/getFFmpegBaseURL';

export const useFFmpeg = () => {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const ffmpeg = new FFmpeg();
                ffmpegRef.current = ffmpeg;

                ffmpeg.on('log', ({ message }) => {
                    setLogs((prev) => [...prev, message]);
                });

                // Определяем платформу и выбираем соответствующий базовый URL
                const platform = detectPlatform();
                const baseURL = getFFmpegBaseURL(platform);

                // console.log(`🚀 Загрузка FFmpeg для платформы: ${platform}`);
                // console.log(`📍 Base URL: ${baseURL}`);

                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
                });

                setIsLoaded(false);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке FFmpeg';
                console.error('❌ Ошибка загрузки FFmpeg:', errorMessage);
                setError(errorMessage);
                setIsLoaded(false);
            }
        };

        load();
    }, []);

    return { ffmpegRef, isLoaded, logs, error };
};
