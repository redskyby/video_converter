'use client';

import { Button, Input } from '@heroui/react';
import React from 'react';

import { useVideoStore } from '@/store/video';

const FileUploader = () => {
    const setFile = useVideoStore((s) => s.setFile);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Input type="file" aria-label="Upload your video file" onChange={handleFileChange} />
            <Button>Upload File</Button>
        </div>
    );
};

export default FileUploader;
