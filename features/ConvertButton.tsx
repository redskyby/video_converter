import { Gear } from '@gravity-ui/icons';
import { Button, Spinner } from '@heroui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConvertButtonProps } from '@/shared/interfaces/ConvertButtonProps';

function ConvertButton({ onClick, isPending, isDisabled = false }: ConvertButtonProps) {
    const { t } = useTranslation('buttons');

    return (
        <Button onClick={onClick} isPending={isPending} isDisabled={isDisabled} className="group font-medium">
            {isPending ? (
                <Spinner color="current" size="sm" />
            ) : (
                // Иконка плавно повернется на 180 градусов при наведении на кнопку
                <Gear className="w-4 h-4 transition-transform duration-500 ease-in-out group-hover:rotate-180" />
            )}
            {isPending ? `${t('converting')}` : `${t('convert')}`}
        </Button>
    );
}

export default ConvertButton;
