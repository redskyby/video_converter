'use client';

import React, { useRef, useState } from 'react';

import { videoStore } from '@/entities/video/videoStore';
import CheckBoxes from '@/features/CheckBoxes';
import ClearFileButton from '@/features/ClearFileButton';
import ConvertButton from '@/features/ConvertButton';
import DownloadVideoButton from '@/features/DownloadVideoButton';
import FileSizeInfo from '@/features/FileSizeInfo';
import FileUploader from '@/features/FileUploader';
import Progress from '@/features/Progress';
import SelectOutputFormat from '@/features/SelectOutputFormat';
import TimeLines from '@/features/TimeLines';
import { useFFmpeg } from '@/shared/lib/hooks/useFFmpeg';
import { useVideoPreview } from '@/shared/lib/hooks/useVideoPreview';
import { FormatSelect } from '@/shared/types/FormatSelect';
import Loader from '@/shared/ui/Loader';
import { detectPlatform } from '@/shared/utils/detectPlatform';
import { handleVideoProcessing } from '@/shared/utils/videoProcessing';
import FFmpegStatus from '@/widgets/FFmpegStatus';
import Header from '@/widgets/Header';

function VideoManager() {
    const videoUrlRef = useRef<string | null>(null);

    const [transcode, setTranscoding] = useState<boolean>(false);
    const [platform] = useState<string>(() => detectPlatform());

    const { ffmpegRef, isLoading, progress, error, setProgress } = useFFmpeg();
    const { videoRef, isFileReady } = useVideoPreview();

    const file = videoStore((s) => s.file);
    const setFile = videoStore((s) => s.setFile);

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
            <Header platform={platform} />

            <FileUploader onReset={handleReset} />

            <div className="flex items-center justify-between gap-4">
                {file && <SelectOutputFormat currentFormat={format} selectFormat={setFormat} />}
                {file && <ClearFileButton onReset={handleReset} />}
            </div>

            <div className="flex items-center justify-between gap-4">
                <ConvertButton onClick={handleConversion} isPending={transcode} isDisabled={isFileReady} />

                {file && <DownloadVideoButton onReset={handleReset} isDisabled={transcode} />}
            </div>

            {file && <FileSizeInfo inputSize={inputSize} outputSize={outputSize} />}

            {file && <Progress value={progress} />}

            {file && !transcode && <video ref={videoRef} controls className="w-full max-w-2xl" />}
            {transcode && <Loader text="Конвертация..." />}

            {file && <CheckBoxes isDisabled={transcode} />}

            {file && !transcode && <TimeLines />}
        </div>
    );
}

export default VideoManager;
