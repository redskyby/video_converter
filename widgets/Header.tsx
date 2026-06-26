'use client';

import { fetchFile } from '@ffmpeg/util';
import { Button, Input, Spinner } from '@heroui/react';
import React, { useEffect, useRef, useState } from 'react';

import { useFFmpeg } from '@/hooks/useFFmpeg';
import { useVideoStore } from '@/store/video';
import { buildFFmpegArgs } from '@/utils/buildFFmpegArgs';
import { detectPlatform } from '@/utils/detectPlatform';

const Header = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoUrlRef = useRef<string | null>(null);

    const [transcoding, setTranscoding] = useState<boolean>(false);
    const [platform] = useState<string>(() => detectPlatform());

    const { ffmpegRef, isLoaded, logs, error } = useFFmpeg();

    const file = useVideoStore((s) => s.file);
    const setFile = useVideoStore((s) => s.setFile);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const transcode = async () => {
        try {
            setTranscoding(true);
            const { file } = useVideoStore.getState();

            if (!file) {
                return;
            }

            const ffmpeg = ffmpegRef.current;

            await ffmpeg?.writeFile(file.name, await fetchFile(file));

            const args = buildFFmpegArgs(file.name);

            await ffmpeg?.exec(args);

            const data = await ffmpeg?.readFile('output.mp4');

            // Проверяем, что данные есть и это вид на ArrayBuffer (Uint8Array или похожий)
            if (videoRef.current && data && ArrayBuffer.isView(data as ArrayBufferView)) {
                // 🔥 если был старый URL — освобождаем
                if (videoUrlRef.current) {
                    URL.revokeObjectURL(videoUrlRef.current);
                }

                const uint8 = data as Uint8Array;

                // Приводим буфер к ArrayBuffer, чтобы соответствовать типам BlobPart
                const blob = new Blob([uint8.buffer as ArrayBuffer], {
                    type: 'video/mp4',
                });

                // Создаем объект File из blob, чтобы соответствовать типу в сторе
                const newFile = new File([blob], 'output.mp4', { type: 'video/mp4' });

                const url = URL.createObjectURL(newFile);

                videoUrlRef.current = url; // сохраняем новый URL
                videoRef.current.src = url;

                // Обновляем глобальный стор — теперь другие компоненты (например, TimeLines)
                // увидят новый отформатированный файл и смогут обработать его
                setFile(newFile);
            }
        } catch (error) {
            console.error('Ошибка во время конвертации:', error);
        } finally {
            setTranscoding(false);
        }
    };

    useEffect(() => {
        if (!file || !videoRef.current) return;

        // 🔥 если был старый URL — освобождаем
        if (videoUrlRef.current) {
            URL.revokeObjectURL(videoUrlRef.current);
        }

        const url = URL.createObjectURL(file);
        videoUrlRef.current = url;
        videoRef.current.src = url;

        return () => {
            if (videoUrlRef.current) {
                URL.revokeObjectURL(videoUrlRef.current);
            }
        };
    }, [file]);

    useEffect(() => {
        return () => {
            if (videoUrlRef.current) {
                URL.revokeObjectURL(videoUrlRef.current);
            }
        };
    }, []);

    if (isLoaded) {
        return (
            <div className="flex items-center gap-4">
                <Spinner />
                <div className="flex flex-col gap-2">
                    <p>Загрузка FFmpeg {platform === 'mobile' ? '(однопоточная)' : '(многопоточная)'}...</p>
                    {platform && (
                        <p className="text-xs text-gray-600">
                            📱 Платформа: {platform === 'mobile' ? 'Мобильное устройство' : 'Десктоп'}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-4 bg-red-100 p-4 rounded-lg border-2 border-red-500">
                <div className="flex-1">
                    <p className="text-red-800 font-semibold">❌ Ошибка загрузки FFmpeg</p>
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-2 p-4 space-y-4'}>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Video converter</h1>
                {platform && (
                    <p className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded">
                        {platform === 'mobile' ? '📱 Мобильное' : '🖥️ Десктоп'} • FFmpeg{' '}
                        {platform === 'mobile' ? 'однопоточный' : 'многопоточный'}
                    </p>
                )}
            </div>
            <Input aria-label="File" type="file" onChange={handleFileChange} className="w-64" />
            <div className="flex items-center gap-4">
                <Button onClick={transcode} isPending={transcoding}>
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm" /> : null}
                            конвертировать
                        </>
                    )}
                </Button>
            </div>

            <div className="bg-gray-100 p-2 rounded text-xs font-mono max-h-40 overflow-auto">{logs}</div>

            {file && <video ref={videoRef} controls className="w-full max-w-2xl"></video>}
        </div>
    );
};

export default Header;
