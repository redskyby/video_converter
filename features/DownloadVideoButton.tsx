import { ArrowDownToLine } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import React from 'react';

import { videoStore } from '@/entities/video/videoStore';
import { OnResetProps } from '@/shared/interfaces/OnResetProps';

const DownloadVideoButton = ({ onReset, isDisabled = false }: OnResetProps) => {
    const file = videoStore((s) => s.file);

    const handleDownload = () => {
        if (!file) {
            console.log('Ошибка при скачивании');
            return;
        }
        onReset();

        const url = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = url;

        link.download = file.name;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            onClick={handleDownload}
            isDisabled={isDisabled}
            className={`font-medium transition-all duration-500 ease-out transform `}
        >
            <ArrowDownToLine className="w-4 h-4" />
            Скачать видео
        </Button>
    );
};

export default DownloadVideoButton;
