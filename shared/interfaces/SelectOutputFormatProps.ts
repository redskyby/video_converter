import React from 'react';

import { FormatSelect } from '@/shared/types/FormatSelect';

export interface SelectOutputFormatProps {
    currentFormat: FormatSelect;
    selectFormat: React.Dispatch<React.SetStateAction<FormatSelect>>;
    isDisabled: boolean;
}
