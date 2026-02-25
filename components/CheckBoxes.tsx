'use client';

import { Checkbox, CheckboxGroup, Description, Label } from '@heroui/react';
import React from 'react';

import { useVideoStore } from '@/store';

const CheckBoxes = () => {
    const flipHorizontal = useVideoStore((s) => s.flipHorizontal);
    const flipVertical = useVideoStore((s) => s.flipVertical);
    const removeMetadata = useVideoStore((s) => s.removeMetadata);

    const setFlipHorizontal = useVideoStore((s) => s.setFlipHorizontal);
    const setFlipVertical = useVideoStore((s) => s.setFlipVertical);
    const setRemoveMetadata = useVideoStore((s) => s.setRemoveMetadata);

    return (
        <CheckboxGroup name="video-options">
            <Label>Настройки видео</Label>
            <Description>Выберите нужные параметры</Description>

            <Checkbox
                value="flipHorizontal"
                isSelected={flipHorizontal}
                onChange={(isSelected) => setFlipHorizontal(isSelected)}
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
                onChange={(isSelected) => setFlipVertical(isSelected)}
            >
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                    <Label>Отзеркалить по вертикали</Label>
                    <Description>Переворачивает видео сверху вниз</Description>
                </Checkbox.Content>
            </Checkbox>

            <Checkbox
                value="removeMetadata"
                isSelected={removeMetadata}
                onChange={(isSelected) => setRemoveMetadata(isSelected)}
            >
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                    <Label>Удалить методанные</Label>
                    <Description>Удаление методанных из видео</Description>
                </Checkbox.Content>
            </Checkbox>
        </CheckboxGroup>
    );
};

export default CheckBoxes;
