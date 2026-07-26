import { FFmpeg } from '@ffmpeg/ffmpeg';

import { FormatSelect } from '@/types';

export interface handleVideoProcessingProps {
    ffmpegRef: React.RefObject<FFmpeg | null>;
    setTranscoding: React.Dispatch<React.SetStateAction<boolean>>;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    videoUrlRef: React.RefObject<string | null>;
    format: FormatSelect;
}
