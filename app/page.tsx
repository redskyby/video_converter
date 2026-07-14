import CheckBoxes from '@/features/CheckBoxes';
import TimeLines from '@/features/TimeLines';
import VideoManager from '@/widgets/VideoManager';

export default function Home() {
    return (
        <div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
            <VideoManager />
            <CheckBoxes />
            <TimeLines />
        </div>
    );
}
