import { FFmpeg } from '@ffmpeg/ffmpeg';

import { FormatSelect } from '@/shared/types/FormatSelect';
import { Resolution } from '@/shared/types/Resolution';

export interface handleVideoProcessingProps {
    ffmpegRef: React.RefObject<FFmpeg | null>;
    setTranscoding: React.Dispatch<React.SetStateAction<boolean>>;
    format: FormatSelect;
    resolution: Resolution;
}
