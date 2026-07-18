import { create } from 'zustand';

import { VideoState } from '@/interfaces/VideoState';

export const useVideoStore = create<VideoState>((set) => ({
    file: null,
    setFile: (file) => set({ file }),
}));
