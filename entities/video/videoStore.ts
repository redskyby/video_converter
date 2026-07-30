import { create } from 'zustand';

import { VideoState } from '@/shared/interfaces/VideoState';

export const videoStore = create<VideoState>((set) => ({
    file: null,
    setFile: (file) => set({ file }),
}));
