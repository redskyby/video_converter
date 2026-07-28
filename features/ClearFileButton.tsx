import { TrashBin } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import React from 'react';

import { OnResetProps } from '@/interfaces/OnResetProps';
import { useVideoStore } from '@/store/video';

const ClearFileButton = ({ onReset }: OnResetProps) => {
    const setFile = useVideoStore((s) => s.setFile);
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
