import { BuildFFmpegArgsProps } from '@/interfaces/BuildFFmpegArgsProps';

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

    const args: string[] = ['-i', fileName];

    // 🔥 Удаление метаданных
    if (removeMetadata) {
        args.push('-map', '0', '-map_metadata', '-1', '-map_chapters', '-1');
    }

    const extension = format.toLowerCase();

    // 🎬 Настройка кодеков под формат
    if (extension === 'webm') {
        args.push('-c:v', 'libvpx', '-c:a', 'libvorbis');
        args.push('-b:v', '0', '-crf', String(crf));
        args.push('-cpu-used', '5', '-deadline', 'good');
    } else {
        // Стандартные настройки для MP4 (x264)
        args.push('-preset', preset, '-crf', String(crf));
    }

    // Ограничиваем потоки для стабильности WASM (0 — авто, но в браузере лучше контролировать)
    args.push('-threads', '0');

    if (filters.length > 0) {
        args.push('-vf', filters.join(','));
    }

    args.push(`output.${extension}`);

    return args;
};
