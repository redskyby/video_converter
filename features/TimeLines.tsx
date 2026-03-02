'use client';

import React, { useEffect, useState } from 'react';

import { useVideoStore } from '@/store/video';
import { Frame } from '@/types'; // Импортируем тип Frame
import { extractFrames } from '@/utils/extractFrames';

const TimeLines = () => {
    const file = useVideoStore((state) => state.file);
    const [frames, setFrames] = useState<Frame[]>([]);

    useEffect(() => {
        // Если файла нет, ничего не делаем
        if (!file) {
            setFrames([]); // Очищаем кадры, если файл был удален
            return;
        }

        let isCancelled = false; // Флаг для предотвращения обновления состояния после размонтирования

        const processVideo = async () => {
            try {
                console.log('Начинаем извлечение кадров...');
                const extractedFrames = await extractFrames(file, 10);

                // Если компонент не размонтирован и эффект не был запущен заново, обновляем состояние
                if (!isCancelled) {
                    console.log('Извлеченные кадры:', extractedFrames);
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
            frames.forEach((frame) => URL.revokeObjectURL(frame.url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]); // Эффект зависит от `file`. `frames` добавлено в `eslint-disable` чтобы избежать зацикливания

    return (
        <div>
            {/* Просто для примера выведем несколько кадров */}
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
