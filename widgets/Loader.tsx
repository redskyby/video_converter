import { Spinner } from '@heroui/react';
import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center gap-4">
            <Spinner size="md" />
        </div>
    );
};

export default Loader;
