'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Frame } from '@/types';

const TimeLines = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateActiveFrame = () => {
            const currentTime = video.currentTime;

            const index = frames.findIndex((frame, i) => {
                const next = frames[i + 1];
                return currentTime >= frame.time && (!next || currentTime < next.time);
            });

            if (index !== -1) {
                setActiveIndex(index);
            }
        };

        video.addEventListener('timeupdate', updateActiveFrame);

        return () => {
            video.removeEventListener('timeupdate', updateActiveFrame);
        };
    }, [frames]);

    return <></>;
};

export default TimeLines;
