import { Frame } from '@/shared/types/Frame';

export interface CleanupVideoResourcesProps {
    videoUrl: string;
    frames: Frame[];
    video: HTMLVideoElement;
}
