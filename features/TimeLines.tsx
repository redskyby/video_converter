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
        // Если файла нет, ничего не делаем
        if (!file) return;

        let isCancelled = false; // Флаг для предотвращения обновления состояния после размонтирования

        const processVideo = async () => {
            try {
                // console.log('Начинаем извлечение кадров...');
                const extractedFrames = await extractFrames(file, 10);

                // Если компонент не размонтирован и эффект не был запущен заново, обновляем состояние
                if (!isCancelled) {
                    // console.log('Извлеченные кадры:', extractedFrames);
                    frameUrlsRef.current = extractedFrames.map((f) => f.url);
                    setFrames(extractedFrames);
                }
            } catch (error) {
                console.error('Ошибка при извлечении кадров:', error);
            }
        };

        processVideo();

        // 👇 Вот функция очистки
        return () => {
            isCancelled = true; // Помечаем, что работа эффекта прервана
            console.log('Очистка... Удаление', frames.length, 'кадров.');
            // Освобождаем память от всех URL-адресов кадров
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
