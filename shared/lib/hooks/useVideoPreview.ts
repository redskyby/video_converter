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
            setFileReady(true);
            return;
        }

        // 🔥 если был старый URL — освобождаем
        if (videoUrlRef.current) {
            URL.revokeObjectURL(videoUrlRef.current);
        }

        const url = URL.createObjectURL(file);
        videoUrlRef.current = url;
        videoRef.current.src = url;

        setFileReady(false);

        detailsStore.getState().resetFilters();

        return () => {
            if (videoUrlRef.current) {
                URL.revokeObjectURL(videoUrlRef.current);
            }
        };
    }, [file]);

    return { videoRef, isFileReady };
};
