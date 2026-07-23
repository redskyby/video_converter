import { fetchFile } from '@ffmpeg/util';

import { handleVideoProcessingProps } from '@/interfaces/HandleVideoProcessingProps';
import { useVideoDetailsStore } from '@/store';
import { useVideoStore } from '@/store/video';
import { buildFFmpegArgs } from '@/utils/buildFFmpegArgs';

export async function handleVideoProcessing({
    ffmpegRef,
    setTranscoding,
    videoRef,
    videoUrlRef,
    setFile,
}: handleVideoProcessingProps) {
    try {
        setTranscoding(true);
        const state = useVideoDetailsStore.getState();
        const { file } = useVideoStore.getState();
        if (!file) {
            console.error('Файл не загружен в стор');
            return;
        }

        const ffmpeg = ffmpegRef.current;

        if (!ffmpeg) {
            console.error('FFmpeg не загружен');
            return;
        }

        await ffmpeg.writeFile(file.name, await fetchFile(file));

        const args = buildFFmpegArgs({
            fileName: file.name,
            flipHorizontal: state.flipHorizontal,
            flipVertical: state.flipVertical,
            preset: state.preset,
            crf: state.crf,
            removeMetadata: state.removeMetadata,
        });

        await ffmpeg.exec(args);

        const data = await ffmpeg?.readFile('output.mp4');

        // Проверяем, что данные есть и это вид на ArrayBuffer (Uint8Array или похожий)
        if (videoRef.current && data && ArrayBuffer.isView(data as ArrayBufferView)) {
            // 🔥 если был старый URL — освобождаем
            if (videoUrlRef.current) {
                URL.revokeObjectURL(videoUrlRef.current);
            }

            const uint8 = data as Uint8Array;

            // Приводим буфер к ArrayBuffer, чтобы соответствовать типам BlobPart
            const blob = new Blob([uint8.buffer as ArrayBuffer], {
                type: 'video/mp4',
            });

            const fileName = `converted-${crypto.randomUUID()}.mp4`;

            // Создаем объект File из blob, чтобы соответствовать типу в сторе
            const newFile = new File([blob], fileName, { type: 'video/mp4' });

            const url = URL.createObjectURL(newFile);

            videoUrlRef.current = url; // сохраняем новый URL
            videoRef.current.src = url;

            setFile(newFile);
        }
    } catch (error) {
        console.error('Ошибка во время конвертации:', error);
    } finally {
        setTranscoding(false);
    }
}
