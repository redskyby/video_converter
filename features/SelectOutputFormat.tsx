import { Label, ListBox, Select } from '@heroui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { SelectOutputFormatProps } from '@/shared/interfaces/SelectOutputFormatProps';
import { FormatSelect } from '@/shared/types/FormatSelect';

import formatOptions from '../shared/config/videoFormatOptions.json';

const SelectOutputFormat = ({ currentFormat, selectFormat, isDisabled }: SelectOutputFormatProps) => {
    const { t } = useTranslation('videoFormat');

    return (
        <Select
            className="w-[256px]"
            placeholder="Select one"
            selectedKey={currentFormat}
            onSelectionChange={(key) => selectFormat(key as FormatSelect)}
            isDisabled={isDisabled}
        >
            <Label>{t('videoFormat')}</Label>
            <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {formatOptions.map((format) => (
                        <ListBox.Item key={format.id} id={format.id} textValue={format.textValue}>
                            {format.textValue}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
};

export default SelectOutputFormat;
