export type Customization = 'flipHorizontal' | 'flipVertical' | 'preset' | 'crf' | 'removeMetadata';

export type Value = boolean | string | number;

export type VideoState = {
    flipHorizontal: boolean;
    flipVertical: boolean;
    preset: string;
    crf: number;
    removeMetadata: boolean;
    setOption: (key: Customization, value: Value) => void;
};
