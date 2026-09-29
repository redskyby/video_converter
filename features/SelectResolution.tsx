import { Label, ListBox, Select } from '@heroui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Resolution } from '@/shared/types/Resolution';

//TODO : ИСПРАВИТЬ "<Label>{t('videoResolution')}</Label>". Проблема : не переключается

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
            placeholder="Select one"
            selectedKey={resolution}
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
                    <ListBox.Item id="1080p" textValue="1080p">
                        1080p
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="720p" textValue="720p">
                        720p
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="480p" textValue="480p">
                        480p
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                </ListBox>
            </Select.Popover>
        </Select>
    );
};

export default SelectResolution;
