import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { useEffect, useRef, useState } from 'react';

export const useFFmpeg = () => {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            const ffmpeg = new FFmpeg();
            ffmpegRef.current = ffmpeg;

            ffmpeg.on('log', ({ message }) => {
                setLogs((prev) => [...prev, message]);
            });

            const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.6/dist/umd';

            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
            });

            setIsLoaded(false);
        };

        load();
    }, []);

    return { ffmpegRef, isLoaded, logs };
};
