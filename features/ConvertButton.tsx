import { Gear } from '@gravity-ui/icons';
import { Button, Spinner } from '@heroui/react';
import React from 'react';

import { ConvertButtonProps } from '@/interfaces/ConvertButtonProps';

function ConvertButton({ onClick, isPending, isDisabled = false }: ConvertButtonProps) {
    return (
        <Button onClick={onClick} isPending={isPending} isDisabled={isDisabled} className="group font-medium">
            {isPending ? (
                <Spinner color="current" size="sm" />
            ) : (
                // Иконка плавно повернется на 180 градусов при наведении на кнопку
                <Gear className="w-4 h-4 transition-transform duration-500 ease-in-out group-hover:rotate-180" />
            )}
            {isPending ? 'конвертация...' : 'конвертировать'}
        </Button>
    );
}

export default ConvertButton;
