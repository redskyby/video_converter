import { create } from 'zustand';

import { VideoState } from '@/types';

export const useVideoStore = create<VideoState>((set) => ({
    flipHorizontal: false,
    flipVertical: false,
    preset: 'ultrafast',
    crf: 28,
    removeMetadata: false,

    setFlipHorizontal: (value: boolean) => set({ flipHorizontal: value }),

    setFlipVertical: (value: boolean) => set({ flipVertical: value }),

    setPreset: (value: string) => set({ preset: value }),

    setCrf: (value: number) => set({ crf: value }),

    setRemoveMetadata: (value: boolean) => set({ removeMetadata: value }),
}));
