'use client';

import React, { useRef, useState } from 'react';

import ConvertButton from '@/features/ConvertButton';
import FileUploader from '@/features/FileUploader';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { useVideoPreview } from '@/hooks/useVideoPreview';
import { useVideoStore } from '@/store/video';
import { detectPlatform } from '@/utils/detectPlatform';
import { handleVideoProcessing } from '@/utils/VideoProcessing';
import FFmpegStatus from '@/widgets/FFmpegStatus';

function VideoManager() {
    const videoUrlRef = useRef<string | null>(null);

    const [transcode, setTranscoding] = useState<boolean>(false);
    const [platform] = useState<string>(() => detectPlatform());

    const { ffmpegRef, isLoading, logs, error } = useFFmpeg();
    const { videoRef, isFileReady } = useVideoPreview();

    const file = useVideoStore((s) => s.file);
    const setFile = useVideoStore((s) => s.setFile);

    const handleConversion = async () => {
        await handleVideoProcessing({ ffmpegRef, setTranscoding, videoRef, videoUrlRef, setFile });
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
            <FileUploader />
            <ConvertButton onClick={handleConversion} isPending={transcode} isDisabled={isFileReady} />

            <div className="bg-gray-100 p-2 rounded text-xs font-mono max-h-40 overflow-auto">{logs}</div>

            {file && <video ref={videoRef} controls className="w-full max-w-2xl"></video>}
        </div>
    );
}

export default VideoManager;
