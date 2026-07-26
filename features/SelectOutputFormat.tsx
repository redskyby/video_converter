import { Label, ListBox, Select } from '@heroui/react';
import React from 'react';

import { FormatSelect } from '@/types';

const SelectOutputFormat = ({
    currentFormat,
    selectFormat,
}: {
    currentFormat: FormatSelect;
    selectFormat: React.Dispatch<React.SetStateAction<FormatSelect>>;
}) => {
    return (
        <Select
            className="w-[256px]"
            placeholder="Select one"
            selectedKey={currentFormat}
            onSelectionChange={(key) => selectFormat(key as FormatSelect)}
        >
            <Label>Формат файла</Label>
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
