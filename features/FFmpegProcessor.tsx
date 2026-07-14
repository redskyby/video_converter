'use client';

import { Button, Spinner } from '@heroui/react';
import React, { useState } from 'react';

import { useFFmpeg } from '@/hooks/useFFmpeg';
import processVideo from '@/shared/utils/processVideo';
import { useVideoStore } from '@/store/video';

const FFmpegProcessor = () => {
    const { ffmpegRef, isLoaded, logs, error } = useFFmpeg();

    const file = useVideoStore((s) => s.file);
    const setFile = useVideoStore((s) => s.setFile);

    const [isProcessing, setProcessing] = useState(false);

    const handleTranscoding = async () => {
        if (!file || !ffmpegRef.current) return;

        setProcessing(true);

        const processedFile = await processVideo(ffmpegRef.current, file);

        if (processedFile) setFile(processedFile);
        setProcessing(false);
    };

    if (isLoaded) return <Spinner />;

    return (
        <div>
            <Button onClick={handleTranscoding} isPending={isProcessing}>
                {isProcessing ? 'Processing...' : 'Convert Video'}
            </Button>
            <div className="text-xs">{logs.join('\n')}</div>
            {error && <p className="text-red-500">Error: {error}</p>}
        </div>
    );
};

export default FFmpegProcessor;
