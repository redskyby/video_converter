'use client';

import React, { useRef, useState } from 'react';

import ConvertButton from '@/features/ConvertButton';
import DownloadVideoButton from '@/features/DownloadVideoButton';
import FileSizeInfo from '@/features/FileSizeInfo';
import FileUploader from '@/features/FileUploader';
import SelectOutputFormat from '@/features/SelectOutputFormat';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { useVideoPreview } from '@/hooks/useVideoPreview';
import { useVideoStore } from '@/store/video';
import { FormatSelect } from '@/types';
import { detectPlatform } from '@/utils/detectPlatform';
import { handleVideoProcessing } from '@/utils/videoProcessing';
import FFmpegStatus from '@/widgets/FFmpegStatus';

//TODO ДОБАВИТЬ ЛОАДЕР ДЛЯ КНОПКИ , ЧТОБЫ Я НЕ МОГ СКАЧИВАТЬ ФАЙЛ ПРИ КАДИРОВКЕ

function VideoManager() {
    const videoUrlRef = useRef<string | null>(null);

    const [transcode, setTranscoding] = useState<boolean>(false);
    const [platform] = useState<string>(() => detectPlatform());

    const { ffmpegRef, isLoading, progress, error, setProgress } = useFFmpeg();
    const { videoRef, isFileReady } = useVideoPreview();

    const file = useVideoStore((s) => s.file);
    const setFile = useVideoStore((s) => s.setFile);

    const [inputSize, setInputSize] = useState<number | null>(null);
    const [outputSize, setOutputSize] = useState<number | null>(null);

    const [format, setFormat] = useState<FormatSelect>('MP4');

    const handleReset = () => {
        setProgress(0);
        setInputSize(null);
        setOutputSize(null);
    };

    const handleConversion = async () => {
        if (!file) return;

        const originalSize = file.size;

        handleReset();

        const convertedFile = await handleVideoProcessing({
            ffmpegRef,
            setTranscoding,
            videoRef,
            videoUrlRef,
            format,
        });

        if (!convertedFile) return;

        setInputSize(originalSize);
        setOutputSize(convertedFile.size);
        setFile(convertedFile);
    };

    if (isLoading || error) {
        return <FFmpegStatus isLoading={isLoading} error={error} platform={platform} />;
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
            <FileUploader onReset={handleReset} />

            {file && <SelectOutputFormat currentFormat={format} selectFormat={setFormat} />}

            <ConvertButton onClick={handleConversion} isPending={transcode} isDisabled={isFileReady} />

            {file && <DownloadVideoButton onReset={handleReset} />}

            {file && <FileSizeInfo inputSize={inputSize} outputSize={outputSize} />}

            <div className="w-full bg-gray-200 rounded flex items-center h-auto pt-1 pb-1 pl-1">
                <div className="bg-blue-500 h-2 rounded transition-all " style={{ width: `${progress}%` }} />
                <p className="text-xs text-gray-600 ">{progress}%</p>
            </div>
            {file && <video ref={videoRef} controls className="w-full max-w-2xl"></video>}
        </div>
    );
}

export default VideoManager;
