import CheckBoxes from '@/features/CheckBoxes';
import TimeLines from '@/features/TimeLines';
import Header from '@/widgets/Header';

export default function Home() {
    return (
        <div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
            <Header />
            <CheckBoxes />
            <TimeLines />
        </div>
    );
}
