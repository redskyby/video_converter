'use client';

import { Input } from '@heroui/react';
import React from 'react';

import { videoStore } from '@/entities/video/videoStore';
import { OnResetProps } from '@/shared/interfaces/OnResetProps';

const FileUploader = ({ onReset }: OnResetProps) => {
    const setFile = videoStore((s) => s.setFile);
    const handleDelete = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onReset();
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex   w-full">
            <Input type="file" aria-label="Upload your video file" onChange={handleDelete} className={'w-full'} />
        </div>
    );
};

export default FileUploader;
