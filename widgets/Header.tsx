import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ platform }: { platform: string | null }) => {
    const { t } = useTranslation('header');

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{t('title')}</h1>
            {platform && (
                <p className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded">
                    {platform === 'mobile' ? `📱 ${t('mobilePlatform')}` : `🖥️ ${t('PC_Platform')}`} • FFmpeg{' '}
                    {platform === 'mobile' ? `${t('singleThread')}` : `${t('multiThread')}`}
                </p>
            )}
        </div>
    );
};

export default Header;
