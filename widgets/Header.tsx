'use client';

import { fetchFile } from '@ffmpeg/util';
import { Button, Input, Spinner } from '@heroui/react';
import React, { useEffect, useRef, useState } from 'react';

import { useFFmpeg } from '@/hooks/useFFmpeg';
import { useVideoStore } from '@/store/video';
import { buildFFmpegArgs } from '@/utils/buildFFmpegArgs';

const Header = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoUrlRef = useRef<string | null>(null);

    const [transcoding, setTranscoding] = useState<boolean>(false);
    // const [file, setFile] = useState<File | null>(null);

    const { ffmpegRef, isLoaded, logs } = useFFmpeg();

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

            if (videoRef.current && data instanceof Uint8Array) {
                // 🔥 если был старый URL — освобождаем
                if (videoUrlRef.current) {
                    URL.revokeObjectURL(videoUrlRef.current);
                }

                const blob = new Blob([new Uint8Array(data)], {
                    type: 'video/mp4',
                });

                const url = URL.createObjectURL(blob);

                videoUrlRef.current = url; // сохраняем новый URL
                videoRef.current.src = url;
            }
        } catch (error) {
            console.error('Ошибка во время конвертации:', error);
        } finally {
            setTranscoding(false);
        }
    };

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
                <p>Загрузка FFmpeg (MT)...</p>
            </div>
        );
    }

    return (
        <div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-2 p-4 space-y-4'}>
            <h1 className="text-xl font-bold">Video converter</h1>
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

            <div className="bg-gray-100 p-2 rounded text-xs font-mono max-h-40 overflow-auto">
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>

            <video ref={videoRef} controls className="w-full max-w-2xl"></video>
        </div>
    );
};

export default Header;
