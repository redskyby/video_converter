import { useEffect, useRef, useState } from 'react';

import { detailsStore } from '@/entities/video/detailsStore';
import { videoStore } from '@/entities/video/videoStore';

export const useVideoPreview = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoUrlRef = useRef<string | null>(null);
    const [isFileReady, setFileReady] = useState<boolean>(true);

    const file = videoStore((s) => s.file);

    useEffect(() => {
        if (!file || !videoRef.current) {
            console.log('Ошибка при загрузке видео!');
            return;
        }

        const video = videoRef.current;

        if (videoUrlRef.current) {
            URL.revokeObjectURL(videoUrlRef.current);
        }

        const url = URL.createObjectURL(file);
        videoUrlRef.current = url;

        video.src = url;

        video.onloadedmetadata = () => {
            setFileReady(false);
        };

        detailsStore.getState().resetFilters();

        return () => {
            if (videoUrlRef.current) {
                URL.revokeObjectURL(videoUrlRef.current);
                videoUrlRef.current = null;
            }
        };
    }, [file]);

    return { videoRef, isFileReady };
};
