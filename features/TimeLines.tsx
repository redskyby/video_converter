'use client';

import Image from 'next/image';
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
            controller.abort();

            frameUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)); // чистим через ref
            frameUrlsRef.current = [];
        };
    }, [file]);

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px' }}>
                {frames.map((frame, index) => (
                    <Image
                        key={frame.time}
                        src={frame.url}
                        alt={`Кадр на ${frame.time.toFixed(2)}с`}
                        width={160}
                        height={100}
                        priority={index < 3}
                        style={{ objectFit: 'contain', border: '1px solid #ccc' }}
                    />
                ))}
            </div>
        </div>
    );
};

export default TimeLines;
