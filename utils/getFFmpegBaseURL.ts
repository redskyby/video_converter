import { Platform } from '@/types';

/**
 * Получает базовый URL для FFmpeg в зависимости от платформы
 */
export const getFFmpegBaseURL = (platform: Platform): string => {
    const version = '0.12.10';

    if (platform === 'mobile') {
        // Однопоточная версия для мобильных
        return `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${version}/dist/umd`;
    }
    // Многопоточная версия для ПК
    return `https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@${version}/dist/umd`;
};
