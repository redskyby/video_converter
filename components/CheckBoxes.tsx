'use client';

import { Checkbox, Label } from '@heroui/react';
import React, {useState} from 'react';

const CheckBoxes = () => {
    const [select, setSelect] = useState<boolean>(true)

    return (
        <div className="flex items-center gap-3">
            <Checkbox
                id="basic-terms"
                isSelected={select}
                onChange={(isSelected: boolean) => setSelect(isSelected)}
            >
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
            </Checkbox>
            <Label htmlFor="basic-terms">Отзеркалить видео?</Label>
            <p>Selected: {select ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default CheckBoxes;
