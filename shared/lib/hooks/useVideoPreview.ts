import { useEffect, useRef, useState } from 'react';

import { detailsStore } from '@/entities/video/detailsStore';
import { videoStore } from '@/entities/video/videoStore';

export const useVideoPreview = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isFileReady, setFileReady] = useState(true);

    const file = videoStore((s) => s.file);

    useEffect(() => {
        if (!file) {
            // Сначала очищаем сам <video>
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVideoUrl(null);
            setFileReady(true);

            return;
        }

        const url = URL.createObjectURL(file);

        setVideoUrl(url);
        setFileReady(false);

        detailsStore.getState().resetFilters();

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    return {
        videoRef,
        videoUrl,
        isFileReady,
    };
};
