import { TrashBin } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import React from 'react';

import { videoStore } from '@/entities/video/videoStore';
import { OnResetProps } from '@/shared/interfaces/OnResetProps';

const ClearFileButton = ({ onReset }: OnResetProps) => {
    const setFile = videoStore((s) => s.setFile);
    const handleFileChange = () => {
        onReset();
        setFile(null);
    };

    return (
        <Button onClick={handleFileChange} isIconOnly variant="danger">
            <TrashBin />
        </Button>
    );
};

export default ClearFileButton;
