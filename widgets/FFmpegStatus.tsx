import { Spinner } from '@heroui/react';
import React from 'react';

import { FFmpegStatusProps } from '@/interfaces/FFmpegStatusProps';

const FFmpegStatus = ({ isLoading, error, platform }: FFmpegStatusProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center gap-4">
                <Spinner />
                <div className="flex flex-col gap-2">
                    <p>Загрузка FFmpeg {platform === 'mobile' ? '(однопоточная)' : '(многопоточная)'}...</p>
                    {platform && (
                        <p className="text-xs text-gray-600">
                            📱 Платформа: {platform === 'mobile' ? 'Мобильное устройство' : 'Десктоп'}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-4 bg-red-100 p-4 rounded-lg border-2 border-red-500">
                <div className="flex-1">
                    <p className="text-red-800 font-semibold">❌ Ошибка загрузки FFmpeg</p>
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return null;
};

export default FFmpegStatus;
