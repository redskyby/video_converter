import { FormatSelect } from '@/shared/types/FormatSelect';
import { Resolution } from '@/shared/types/Resolution';

export interface BuildFFmpegArgsProps {
    fileName: string;
    flipHorizontal: boolean;
    flipVertical: boolean;
    preset: string;
    crf: number;
    removeMetadata: boolean;
    removeSound: boolean;
    format: FormatSelect;
    resolution: Resolution;
}
