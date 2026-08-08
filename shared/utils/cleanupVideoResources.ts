import { CleanupVideoResourcesProps } from '@/shared/interfaces/CleanupVideoResourcesProps';

export const cleanupVideoResources = ({ videoUrl, frames, video }: CleanupVideoResourcesProps) => {
    URL.revokeObjectURL(videoUrl);

    frames.forEach((frame) => {
        URL.revokeObjectURL(frame.url);
    });

    video.onloadedmetadata = null;
    video.onseeked = null;
    video.onerror = null;

    video.pause();
};
