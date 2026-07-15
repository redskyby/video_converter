import { Button, Spinner } from '@heroui/react';
import React from 'react';

import { ConvertButtonProps } from '@/interfaces/ConvertButtonProps';

function ConvertButton({ onClick, isPending, isDisabled = false }: ConvertButtonProps) {
    return (
        <Button onClick={onClick} isPending={isPending} isDisabled={isDisabled}>
            {({ isPending }) => (
                <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    конвертировать
                </>
            )}
        </Button>
    );
}

export default ConvertButton;
