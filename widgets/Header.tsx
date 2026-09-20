import React from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcherButton } from '@/features/LanguageSwitcherButton';

const Header = ({ platform }: { platform: string | null }) => {
    const { t } = useTranslation('header');

    return (
        <header className="flex sm:flex-row justify-between ">
            <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            </div>

            <div className="flex flex-col items-start sm:items-end sm:gap-2 justify-center">
                <LanguageSwitcherButton />
                {platform && (
                    <p className="mt-2 hidden sm:block text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded">
                        {platform === 'mobile' ? `📱 ${t('mobilePlatform')}` : `🖥️ ${t('PC_Platform')}`} • FFmpeg{' '}
                        {platform === 'mobile' ? `${t('singleThread')}` : `${t('multiThread')}`}
                    </p>
                )}
            </div>
        </header>
    );
};

export default Header;
