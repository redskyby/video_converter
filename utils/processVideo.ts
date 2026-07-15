import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

import { buildFFmpegArgs } from '@/utils/buildFFmpegArgs';

const processVideo = async (ffmpeg: FFmpeg, file: File): Promise<File | null> => {
    try {
        await ffmpeg.writeFile(file.name, await fetchFile(file)); // Записываем файл в FFmpeg виртуальную ФС

        const args = buildFFmpegArgs(file.name); // Аргументы FFmpeg
        await ffmpeg.exec(args);

        const data = (await ffmpeg.readFile('output.mp4')) as Uint8Array;

        const safeData = new Uint8Array(data);

        const newFile = new File([safeData], 'output.mp4', { type: 'video/mp4' });
        return newFile;
    } catch (error) {
        console.error('Ошибка обработки файла:', error);
        return null;
    }
};

export default processVideo;
