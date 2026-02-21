'use client';

import { Checkbox, CheckboxGroup, Description, Label } from '@heroui/react';
import React from 'react';

import { useVideoStore } from '@/store';

const CheckBoxes = () => {
    const flipHorizontal = useVideoStore((s) => s.flipHorizontal);
    const flipVertical = useVideoStore((s) => s.flipVertical);

    const setOption = useVideoStore((s) => s.setOption);

    return (
        <CheckboxGroup name="video-options">
            <Label>Настройки видео</Label>
            <Description>Выберите нужные параметры</Description>

            <Checkbox
                value="flipHorizontal"
                isSelected={flipHorizontal}
                onChange={() => setOption('flipHorizontal', !flipHorizontal)}
            >
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                    <Label>Отзеркалить по горизонтали</Label>
                    <Description>Переворачивает видео слева направо</Description>
                </Checkbox.Content>
            </Checkbox>

            <Checkbox
                value="flipVertical"
                isSelected={flipVertical}
                onChange={() => setOption('flipVertical', !flipVertical)}
            >
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                    <Label>Отзеркалить по вертикали</Label>
                    <Description>Переворачивает видео сверху вниз</Description>
                </Checkbox.Content>
            </Checkbox>
        </CheckboxGroup>
    );
};

export default CheckBoxes;
