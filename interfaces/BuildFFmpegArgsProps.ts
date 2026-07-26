import { FormatSelect } from '@/types';

export interface BuildFFmpegArgsProps {
    fileName: string;
    flipHorizontal: boolean;
    flipVertical: boolean;
    preset: string;
    crf: number;
    removeMetadata: boolean;
    format: FormatSelect;
}
