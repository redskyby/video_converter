import { ArrowDownToLine } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import React from 'react';

import { useVideoStore } from '@/store/video';

const DownloadVideoButton = () => {
    const file = useVideoStore((s) => s.file);

    const handleDownload = () => {
        if (!file) {
            console.log('Ошибка при скачивании');
            return;
        }

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
            isDisabled={!file}
            className={`font-medium transition-all duration-500 ease-out transform ${
                file ? 'opacity-100 translate-y-0 scale-100' : 'opacity-60 -translate-y-1 scale-98'
            }`}
        >
            <ArrowDownToLine className="w-4 h-4" />
            {file ? 'Скачать видео' : 'Видео не выбрано'}
        </Button>
    );
};

export default DownloadVideoButton;
