'use client';

import { Input } from '@heroui/react';
import React, { useEffect, useRef } from 'react';

import { videoStore } from '@/entities/video/videoStore';
import { OnResetProps } from '@/shared/interfaces/OnResetProps';

const FileUploader = ({ onReset, isDisabled }: OnResetProps) => {
    const setFile = videoStore((s) => s.setFile);
    const inputRef = useRef<HTMLInputElement>(null);
    const file = videoStore((s) => s.file);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onReset();
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (!file && inputRef.current) {
            inputRef.current.value = '';
        }
    }, [file]);

    return (
        <div className="flex   w-full">
            <Input
                ref={inputRef}
                type="file"
                aria-label="Upload your video file"
                onChange={handleFileChange}
                className={'w-full'}
                disabled={isDisabled}
            />
        </div>
    );
};

export default FileUploader;
