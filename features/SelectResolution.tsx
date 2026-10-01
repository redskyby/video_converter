import { Label, ListBox, Select } from '@heroui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Resolution } from '@/shared/types/Resolution';

import options from '../shared/config/resolutionOptions.json';

const SelectResolution = ({
    resolution,
    setResolution,
    isDisabled,
}: {
    resolution: Resolution;
    setResolution: React.Dispatch<React.SetStateAction<Resolution>>;
    isDisabled: boolean;
}) => {
    const { t } = useTranslation('videoResolution');

    return (
        <Select
            className="w-[256px]"
            selectedKey={resolution}
            placeholder="Select one"
            onSelectionChange={(key) => setResolution(key as Resolution)}
            isDisabled={isDisabled}
        >
            <Label>{t('videoResolution')}</Label>
            <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {options.map((option) => (
                        <ListBox.Item key={option.id} id={option.id} textValue={option.textValue}>
                            {option.textValue}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
};

export default SelectResolution;
