import { create } from 'zustand';

import { VideoState } from '@/types';

export const useVideoStore = create<VideoState>((set) => ({
    flipHorizontal: false,
    flipVertical: false,
    preset: 'ultrafast',
    crf: 28,
    removeMetadata: false,
    setOption: (key, value) => set({ [key]: value }),
}));
