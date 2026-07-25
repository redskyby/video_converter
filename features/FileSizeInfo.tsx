import React from 'react';

import { FileSizeInfoProps } from '@/interfaces/FileSizeInfoProps';

const FileSizeInfo = ({ inputSize, outputSize }: FileSizeInfoProps) => {
    return (
        <div>
            {inputSize && <p>Входной: {(inputSize / 1024 / 1024).toFixed(2)} МБ</p>}
            {outputSize && <p>Выходной: {(outputSize / 1024 / 1024).toFixed(2)} МБ</p>}
        </div>
    );
};

export default FileSizeInfo;
