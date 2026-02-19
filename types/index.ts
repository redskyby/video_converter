export type Customization = "flipHorizontal" | "flipVertical" | "preset" | "crf";

export type Value = boolean | string | number;

export type VideoState = {
    flipHorizontal: boolean;
    flipVertical: boolean;
    preset: string;
    crf: number;
    setOption: (key: Customization, value: Value) => void;
};