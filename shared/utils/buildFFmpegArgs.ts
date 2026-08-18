import { BuildFFmpegArgsProps } from '@/shared/interfaces/BuildFFmpegArgsProps';

export const buildFFmpegArgs = ({
    fileName,
    flipHorizontal,
    flipVertical,
    preset,
    crf,
    removeMetadata,
    format,
}: BuildFFmpegArgsProps): string[] => {
    const filters: string[] = [];

    if (flipHorizontal) filters.push('hflip');
    if (flipVertical) filters.push('vflip');

    const extension = format.toLowerCase();

    const args = ['-i', fileName, '-map', '0:v:0', '-map', '0:a:0?'];

    // 🔥 Удаление метаданных
    if (removeMetadata) {
        args.push('-map_metadata', '-1', '-map_chapters', '-1');
    }

    if (extension === 'webm') {
        // WebM
        args.push(
            // Video
            '-c:v',
            'libvpx',
            '-b:v',
            '500k',

            // Audio
            '-c:a',
            'libvorbis',
            '-b:a',
            '96k',

            // WASM
            '-threads',
            '1',

            '-deadline',
            'realtime',
            '-cpu-used',
            '8',
        );
    } else {
        // MP4
        args.push(
            '-c:v',
            'libx264',

            '-preset',
            preset,

            '-crf',
            String(crf),

            // Не перекодируем AAC
            '-c:a',
            'copy',

            // Можно использовать автоматическое количество потоков
            '-threads',
            '0',

            '-movflags',
            '+faststart',
        );
    }

    if (filters.length > 0) {
        args.push('-vf', filters.join(','));
    }

    args.push(`output.${extension}`);

    return args;
};
