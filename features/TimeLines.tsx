'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useVideoStore } from '@/store/video';
import { Frame } from '@/types';
import { extractFrames } from '@/utils/extractFrames';

const TimeLines = () => {
    const file = useVideoStore((state) => state.file);
    const [frames, setFrames] = useState<Frame[]>([]);
    const frameUrlsRef = useRef<string[]>([]);

    useEffect(() => {
        if (!file) {
            frameUrlsRef.current.forEach(URL.revokeObjectURL);
            frameUrlsRef.current = [];

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFrames([]);

            return;
        }

        const controller = new AbortController();

        const processVideo = async () => {
            try {
                // console.log('Начинаем извлечение кадров...');
                const extractedFrames = await extractFrames({
                    file: file,
                    frameCount: 10,
                    signal: controller.signal,
                });

                if (!controller.signal.aborted) {
                    frameUrlsRef.current = extractedFrames.map((f) => f.url);

                    setFrames(extractedFrames);
                }
            } catch (error) {
                console.error('Ошибка при извлечении кадров:', error);
            }
        };

        processVideo();

        return () => {
            // isCancelled = true; // Помечаем, что работа эффекта прервана
            // Освобождаем память от всех URL-адресов кадров
            controller.abort();

            frameUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)); // чистим через ref
            frameUrlsRef.current = [];
        };
    }, [file]);

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px' }}>
                {frames.map((frame) => (
                    <img
                        key={frame.time}
                        src={frame.url}
                        alt={`Кадр на ${frame.time.toFixed(2)}с`}
                        style={{ height: '100px', border: '1px solid #ccc' }}
                    />
                ))}
            </div>
        </div>
    );
};

export default TimeLines;
