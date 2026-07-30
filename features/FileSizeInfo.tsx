import React from 'react';

import { FileSizeInfoProps } from '@/shared/interfaces/FileSizeInfoProps';

const FileSizeInfo = ({ inputSize, outputSize }: FileSizeInfoProps) => {
    return (
        <div>
            {inputSize && <p>Первоначальный размер: {(inputSize / 1024 / 1024).toFixed(2)} МБ</p>}
            {outputSize && <p>Размер после конвертации: {(outputSize / 1024 / 1024).toFixed(2)} МБ</p>}
        </div>
    );
};

export default FileSizeInfo;
