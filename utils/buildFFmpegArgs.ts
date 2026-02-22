import { useVideoStore } from '@/store';

export const buildFFmpegArgs = (fileName: string) => {
    const { flipHorizontal, flipVertical, preset, crf } = useVideoStore.getState();

    const filters: string[] = [];

    if (flipHorizontal) filters.push('hflip');
    if (flipVertical) filters.push('vflip');

    const args = ['-i', fileName, '-preset', preset, '-crf', String(crf), '-threads', '0'];

    if (filters.length > 0) {
        args.push('-vf', filters.join(','));
    }

    args.push('output.mp4');

    return args;
};
