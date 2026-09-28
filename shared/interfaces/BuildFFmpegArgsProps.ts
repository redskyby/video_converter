import { FormatSelect } from '@/shared/types/FormatSelect';

export interface BuildFFmpegArgsProps {
    fileName: string;
    flipHorizontal: boolean;
    flipVertical: boolean;
    preset: string;
    crf: number;
    removeMetadata: boolean;
    removeSound: boolean;
    format: FormatSelect;
}
