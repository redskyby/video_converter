import { Label, ProgressBar } from '@heroui/react';
import React from 'react';

const Progress = ({ value }: { value: number }) => {
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
