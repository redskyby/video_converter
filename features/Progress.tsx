import { Label, ProgressBar } from '@heroui/react';
import React from 'react';

import { ProgressProps } from '@/shared/interfaces/ProgressProps';

const Progress = ({ value }: ProgressProps) => {
    return (
        <ProgressBar aria-label="Loading" className="w-full" value={value}>
            <Label>Loading</Label>
            <ProgressBar.Output />
            <ProgressBar.Track>
                <ProgressBar.Fill />
            </ProgressBar.Track>
        </ProgressBar>
    );
};

export default Progress;
