import { create } from 'zustand';

import { VideoDetails } from '@/shared/interfaces/VideoDetails';

export const detailsStore = create<VideoDetails>((set) => ({
    flipHorizontal: false,
    flipVertical: false,
    preset: 'ultrafast',
    crf: 23,
    removeMetadata: false,
    removeSound: false,

    setFlipHorizontal: (value: boolean) => set({ flipHorizontal: value }),

    setFlipVertical: (value: boolean) => set({ flipVertical: value }),

    setPreset: (value: string) => set({ preset: value }),

    setCrf: (value: number) => set({ crf: value }),

    setRemoveMetadata: (value: boolean) => set({ removeMetadata: value }),

    setRemoveSound: (value: boolean) => set({ removeSound: value }),

    resetFilters: () =>
        set({
            flipHorizontal: false,
            flipVertical: false,
            removeMetadata: false,
            removeSound: false,
        }),
}));
