export interface VideoState {
    flipHorizontal: boolean;
    flipVertical: boolean;
    preset: string;
    crf: number;
    removeMetadata: boolean;

    setFlipHorizontal: (value: boolean) => void;
    setFlipVertical: (value: boolean) => void;
    setPreset: (value: string) => void;
    setCrf: (value: number) => void;
    setRemoveMetadata: (value: boolean) => void;
}
