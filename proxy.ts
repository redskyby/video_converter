import { createProxy } from 'next-i18next/proxy';

import i18n from './next-i18next.config';

export const proxy = createProxy(i18n);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)'],
};
