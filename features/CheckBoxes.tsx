'use client';

import { Checkbox, Description, Label } from '@heroui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

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

    const { t } = useTranslation('videoSettings');

    return (
        <>
            {file && (
                <div className="border-2 p-4 rounded-lg space-y-3">
                    <div>
                        <p className="text-sm font-medium">{t('videoSettings')}</p>

                        <p className="text-xs text-gray-500">{t('chooseOptions')}</p>
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

                                <Label>{t('flipHorizontal')}</Label>
                            </Checkbox.Content>

                            <Description>{t('flipHorizontalDescription')}</Description>
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

                                <Label>{t('flipVertical')}</Label>
                            </Checkbox.Content>

                            <Description>{t('flipVerticalDescription')}</Description>
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

                                <Label>{t('removeMetadata')}</Label>
                            </Checkbox.Content>

                            <Description>{t('removeMetadataDescription')}</Description>
                        </Checkbox>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckBoxes;
