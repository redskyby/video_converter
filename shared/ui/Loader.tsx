import { Spinner } from '@heroui/react';
import React from 'react';

const Loader = ({ text }: { text?: string }) => {
    return (
        <div className="flex items-center justify-center gap-4">
            <Spinner />
            <p>{text || 'Загрузка...'}</p>
        </div>
    );
};

export default Loader;
