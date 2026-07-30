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
                <div className="border-2 p-4 rounded-lg space-y-3">
                    <div>
                        <p className="text-sm font-medium">Настройки видео</p>
                        <p className="text-xs text-gray-500">Выберите нужные параметры</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Checkbox
                            isDisabled={isDisabled}
                            value="flipHorizontal"
                            isSelected={flipHorizontal}
                            onChange={(isSelected) => setFlipHorizontal(isSelected)}
                        >
                            <Checkbox.Content>
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                                <Label>Отзеркалить по горизонтали</Label>
                            </Checkbox.Content>
                            <Description>Переворачивает видео слева направо</Description>
                        </Checkbox>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Checkbox
                            isDisabled={isDisabled}
                            value="flipVertical"
                            isSelected={flipVertical}
                            onChange={(isSelected) => setFlipVertical(isSelected)}
                        >
                            <Checkbox.Content>
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                                <Label>Отзеркалить по вертикали</Label>
                            </Checkbox.Content>
                            <Description>Переворачивает видео сверху вниз</Description>
                        </Checkbox>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Checkbox
                            isDisabled={isDisabled}
                            value="removeMetadata"
                            isSelected={removeMetadata}
                            onChange={(isSelected) => setRemoveMetadata(isSelected)}
                        >
                            <Checkbox.Content>
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                                <Label>Удалить методанные</Label>
                            </Checkbox.Content>
                            <Description>Удаление методанных из видео</Description>
                        </Checkbox>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckBoxes;
