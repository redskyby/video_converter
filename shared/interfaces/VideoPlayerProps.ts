import React from 'react';

export interface VideoPlayerProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    videoUrl: string | null;
}
