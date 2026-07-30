import React from 'react';

import { FFmpegStatusProps } from '@/shared/interfaces/FFmpegStatusProps';
import Loader from '@/shared/ui/Loader';

const FFmpegStatus = ({ isLoading, error, platform }: FFmpegStatusProps) => {
    if (isLoading) {
        return <Loader text={`Загрузка FFmpeg ${platform === 'mobile' ? '(однопоточная)' : '(многопоточная)'}...`} />;
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
