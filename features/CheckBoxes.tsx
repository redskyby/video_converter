'use client';

import { Checkbox, Description, Label } from '@heroui/react';
import React from 'react';

import { detailsStore } from '@/entities/video/detailsStore';
import { videoStore } from '@/entities/video/videoStore';
import { CheckBoxesProps } from '@/shared/interfaces/CheckBoxesProps';

const CheckBoxes = ({ isDisabled }: CheckBoxesProps) => {
    const flipHorizontal = detailsStore((s) => s.flipHorizontal);
    const flipVertical = detailsStore((s) => s.flipVertical);
    const removeMetadata = detailsStore((s) => s.removeMetadata);

    const setFlipHorizontal = detailsStore((s) => s.setFlipHorizontal);
    const setFlipVertical = detailsStore((s) => s.setFlipVertical);
    const setRemoveMetadata = detailsStore((s) => s.setRemoveMetadata);

    const file = videoStore((s) => s.file);

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
