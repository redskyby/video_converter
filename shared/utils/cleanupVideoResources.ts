import { Frame } from '@/shared/types/Frame';

export const cleanupVideoResources = (videoUrl: string, frames: Frame[], video: HTMLVideoElement) => {
    URL.revokeObjectURL(videoUrl);

    frames.forEach((frame) => {
        URL.revokeObjectURL(frame.url);
    });

    video.pause();

    video.onloadedmetadata = null;
    video.onseeked = null;
    video.onerror = null;
};
