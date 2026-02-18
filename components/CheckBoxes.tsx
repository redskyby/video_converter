'use client';

import { Checkbox, Label } from '@heroui/react';
import React from 'react';

const CheckBoxes = () => {
    return (
        <div className="flex items-center gap-3">
            <Checkbox id="basic-terms">
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
            </Checkbox>
            <Label htmlFor="basic-terms">Отзеркалить видео?</Label>
        </div>
    );
};

export default CheckBoxes;
