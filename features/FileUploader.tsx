'use client';

import { Input } from '@heroui/react';
import React from 'react';

import { OnResetProps } from '@/interfaces/OnResetProps';
import { useVideoStore } from '@/store/video';

const FileUploader = ({ onReset }: OnResetProps) => {
    const setFile = useVideoStore((s) => s.setFile);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onReset();
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Input type="file" aria-label="Upload your video file" onChange={handleFileChange} />
        </div>
    );
};

export default FileUploader;
