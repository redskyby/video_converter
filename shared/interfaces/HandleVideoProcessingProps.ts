import { FFmpeg } from '@ffmpeg/ffmpeg';

import { FormatSelect } from '@/shared/types/FormatSelect';

export interface handleVideoProcessingProps {
    ffmpegRef: React.RefObject<FFmpeg | null>;
    setTranscoding: React.Dispatch<React.SetStateAction<boolean>>;
    format: FormatSelect;
}
