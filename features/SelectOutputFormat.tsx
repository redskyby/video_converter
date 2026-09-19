import { Label, ListBox, Select } from '@heroui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { SelectOutputFormatProps } from '@/shared/interfaces/SelectOutputFormatProps';
import { FormatSelect } from '@/shared/types/FormatSelect';

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
                    <ListBox.Item id="MP4" textValue="MP4">
                        MP4
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="WebM" textValue="WebM">
                        WebM
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                </ListBox>
            </Select.Popover>
        </Select>
    );
};

export default SelectOutputFormat;
