'use client';

import React, { useEffect, useRef } from 'react';

import { useVideoStore } from '@/store/video';

const VideoPreview = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const file = useVideoStore((s) => s.file);

    useEffect(() => {
        if (!file || !videoRef.current) return;

        const url = URL.createObjectURL(file);
        videoRef.current.src = url;

        return () => {
            URL.revokeObjectURL(url); // Очистка памяти
        };
    }, [file]);

    if (!file) return <p>🎥 Загрузите видео для превью</p>;

    return <video ref={videoRef} controls />;
};

export default VideoPreview;
