import { VideoPlayerProps } from '@/shared/interfaces/VideoPlayerProps';

const VideoPlayer = ({ videoRef, videoUrl }: VideoPlayerProps) => {
    return (
        <div className="flex items-center justify-center w-full">
            <video
                ref={videoRef}
                src={videoUrl ?? undefined}
                controls
                className="w-full max-w-xl flex items-center justify-center rounded-lg"
            />
        </div>
    );
};

export default VideoPlayer;
