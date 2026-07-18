'use client';

import { fetchFile } from '@ffmpeg/util';
import { Spinner } from '@heroui/react';
import React, { useEffect, useRef, useState } from 'react';

import ConvertButton from '@/features/ConvertButton';
import FileUploader from '@/features/FileUploader';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { useVideoStore } from '@/store/video';
import { detectPlatform } from '@/utils/detectPlatform';
import { handleVideoProcessing } from '@/utils/VideoProcessing';

//TODO : REFACTOR IT

function VideoManager() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoUrlRef = useRef<string | null>(null);

    const [transcode, setTranscoding] = useState<boolean>(false);
    const [buttonDisable, setButtonDisable] = useState<boolean>(true);
    const [platform] = useState<string>(() => detectPlatform());

    const { ffmpegRef, isLoaded, logs, error } = useFFmpeg();

    const file = useVideoStore((s) => s.file);
    const setFile = useVideoStore((s) => s.setFile);

    const handleConversion = async () => {
        await handleVideoProcessing({ ffmpegRef, setTranscoding, videoRef, videoUrlRef, setFile, setButtonDisable });
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

        setButtonDisable(false);

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
            <FileUploader />
            <ConvertButton onClick={handleConversion} isPending={transcode} isDisabled={buttonDisable} />

            <div className="bg-gray-100 p-2 rounded text-xs font-mono max-h-40 overflow-auto">{logs}</div>

            {file && <video ref={videoRef} controls className="w-full max-w-2xl"></video>}
        </div>
    );
}

export default VideoManager;
