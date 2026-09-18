import type { I18nConfig } from 'next-i18next/proxy';

const i18n: I18nConfig = {
    supportedLngs: ['en', 'ru'],
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    // Recommended: works on all platforms including Vercel/serverless
    resourceLoader: (language, namespace) => import(`./app/i18n/locales/${language}/${namespace}.json`),
};

export default i18n;
