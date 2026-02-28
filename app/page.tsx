'use client';

import { useState } from 'react';

import CheckBoxes from '@/components/CheckBoxes';
import Header from '@/components/Header';
import TimeLines from '@/components/TimeLines';

export default function Home() {
    return (
        <div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
            <Header />
            <CheckBoxes />
            <TimeLines />
        </div>
    );
}
