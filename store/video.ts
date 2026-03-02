import { create } from 'zustand';

import { VideoState } from '@/interfaces';

export const useVideoStore = create<VideoState>((set) => ({
    file: null,
    setFile: (file) => set({ file }),
}));
