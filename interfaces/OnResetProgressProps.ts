export interface OnResetProgressProps {
    onResetProgress: React.Dispatch<React.SetStateAction<number>>;
    onResetInputSize: React.Dispatch<React.SetStateAction<number | null>>;
    onResetOutputSize: React.Dispatch<React.SetStateAction<number | null>>;
}
