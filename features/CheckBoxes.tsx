'use client';

import { Checkbox, Description, Label } from '@heroui/react';
import React from 'react';

import { CheckBoxesProps } from '@/interfaces/CheckBoxesProps';
import { useVideoDetailsStore } from '@/store';
import { useVideoStore } from '@/store/video';

const CheckBoxes = ({ isDisabled }: CheckBoxesProps) => {
    const flipHorizontal = useVideoDetailsStore((s) => s.flipHorizontal);
    const flipVertical = useVideoDetailsStore((s) => s.flipVertical);
    const removeMetadata = useVideoDetailsStore((s) => s.removeMetadata);

    const setFlipHorizontal = useVideoDetailsStore((s) => s.setFlipHorizontal);
    const setFlipVertical = useVideoDetailsStore((s) => s.setFlipVertical);
    const setRemoveMetadata = useVideoDetailsStore((s) => s.setRemoveMetadata);

    const file = useVideoStore((s) => s.file);

    return (
        <>
            {file && (
                <div>
                    <Label>Настройки видео</Label>
                    <Description>Выберите нужные параметры</Description>

                    <Checkbox
                        isDisabled={isDisabled}
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
                        isDisabled={isDisabled}
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
                        isDisabled={isDisabled}
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
                </div>
            )}
        </>
    );
};

export default CheckBoxes;
