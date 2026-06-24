export type Platform = 'mobile' | 'desktop';

/**
 * Определяет тип платформы пользователя
 * @returns 'mobile' для мобильных устройств, 'desktop' для ПК
 */
export const detectPlatform = (): Platform => {
    // Проверяем только на клиенте
    if (typeof window === 'undefined') {
        return 'desktop'; // По умолчанию desktop для SSR
    }

    // Проверяем User Agent
    const userAgent = navigator.userAgent.toLowerCase();

    const mobilePatterns = [
        /mobile|android|iphone|ipad|ipod|webos|blackberry|iemobile|opera mini/i,
        /windows phone|wpdesktop/i,
    ];

    const isMobile = mobilePatterns.some((pattern) => pattern.test(userAgent));

    // Дополнительная проверка через maxTouchPoints (более надёжно)
    if (isMobile && navigator.maxTouchPoints > 0) {
        return 'mobile';
    }

    // Проверяем размер экрана (до 768px обычно мобильные)
    const isTouchDevice =
        navigator.maxTouchPoints > 0 ||
        ('msMaxTouchPoints' in navigator && ((navigator as Record<string, unknown>).msMaxTouchPoints as number) > 0);

    if (isTouchDevice && window.innerWidth < 768) {
        return 'mobile';
    }

    return 'desktop';
};

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
