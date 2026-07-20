import { useEffect, useRef, useState } from 'react';

import { useVideoDetailsStore } from '@/store';
import { useVideoStore } from '@/store/video';

export const useVideoPreview = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoUrlRef = useRef<string | null>(null);
    const [isFileReady, setFileReady] = useState(true);

    const file = useVideoStore((s) => s.file);

    useEffect(() => {
        if (!file || !videoRef.current) return;

        // 🔥 если был старый URL — освобождаем
        if (videoUrlRef.current) {
            URL.revokeObjectURL(videoUrlRef.current);
        }

        const url = URL.createObjectURL(file);
        videoUrlRef.current = url;
        videoRef.current.src = url;

        setFileReady(false);

        useVideoDetailsStore.getState().resetFilters();

        return () => {
            if (videoUrlRef.current) {
                URL.revokeObjectURL(videoUrlRef.current);
            }
        };
    }, [file]);

    return { videoRef, isFileReady };
};
