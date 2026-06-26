import { Platform } from '@/types';

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
