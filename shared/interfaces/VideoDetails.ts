import { Resolution } from '@/shared/types/Resolution';

export interface VideoDetails {
    flipHorizontal: boolean;
    flipVertical: boolean;
    preset: string;
    crf: number;
    removeMetadata: boolean;
    removeSound: boolean;
    resolution: Resolution;
    setFlipHorizontal: (value: boolean) => void;
    setFlipVertical: (value: boolean) => void;
    setPreset: (value: string) => void;
    setCrf: (value: number) => void;
    setRemoveMetadata: (value: boolean) => void;
    setRemoveSound: (value: boolean) => void;
    setResolution: (value: Resolution) => void;
    resetFilters: () => void;
}
