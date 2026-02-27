import React, { useEffect, useRef, useState } from 'react';

import { Frame } from '@/types';

const TimeLines = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleFrameClick = (frame: Frame, index: number) => {
        if (!videoRef.current) return;

        videoRef.current.currentTime = frame.time;
        setActiveIndex(index);
    };

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

    return (
        <>
            <video ref={videoRef} controls className="w-full rounded" />

            <div className="flex gap-2 mt-3 overflow-x-auto">
                {frames.map((frame, index) => (
                    <img
                        key={index}
                        src={frame.url}
                        onClick={() => handleFrameClick(frame, index)}
                        className={`
                    h-20 cursor-pointer rounded
                    ${index === activeIndex ? 'ring-4 ring-blue-500' : ''}
                `}
                    />
                ))}
            </div>
        </>
    );
};

export default TimeLines;
