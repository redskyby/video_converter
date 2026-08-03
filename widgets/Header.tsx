import React from 'react';

const Header = ({ platform }: { platform: string | null }) => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Video converter</h1>
            {platform && (
                <p className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded">
                    {platform === 'mobile' ? '📱 Мобильное' : '🖥️ Десктоп'} • FFmpeg{' '}
                    {platform === 'mobile' ? 'однопоточный' : 'многопоточный'}
                </p>
            )}
        </div>
    );
};

export default Header;
