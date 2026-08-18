'use client';

import Image from 'next/image';
import React from 'react';

import { videoStore } from '@/entities/video/videoStore';
import { useFramesExtraction } from '@/shared/lib/hooks/useFramesExtraction';
import Loader from '@/shared/ui/Loader';

const TimeLines = () => {
    const file = videoStore((state) => state.file);

    const { frames, loading } = useFramesExtraction(file, 10);

    if (loading) return <Loader text="Извлечение кадров..." />;

    return (
        <div className="flex gap-2.5 overflow-x-auto p-2.5 border-2 rounded-lg">
            {frames.map((frame, index) => (
                <Image
                    key={frame.time}
                    src={frame.url}
                    alt={`Кадр на ${frame.time.toFixed(2)}с`}
                    width={160}
                    height={100}
                    priority={index < 3}
                    className="object-contain border border-gray-400"
                />
            ))}
        </div>
    );
};

export default TimeLines;
