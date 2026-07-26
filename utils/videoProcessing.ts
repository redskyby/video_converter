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
    format,
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
            format: format,
        });

        await ffmpeg.exec(args);

        const extension = format.toLowerCase();

        const data = await ffmpeg.readFile(`output.${extension}`);

        // Проверяем, что данные есть и это вид на ArrayBuffer (Uint8Array или похожий)
        if (videoRef.current && data && ArrayBuffer.isView(data as ArrayBufferView)) {
            // 🔥 если был старый URL — освобождаем
            if (videoUrlRef.current) {
                URL.revokeObjectURL(videoUrlRef.current);
            }

            const uint8 = data as Uint8Array;

            // Приводим буфер к ArrayBuffer, чтобы соответствовать типам BlobPart
            const mimeType = format === 'MP4' ? 'video/mp4' : 'video/webm';

            const blob = new Blob([uint8.buffer as ArrayBuffer], {
                type: mimeType,
            });

            const fileName = `converted-${crypto.randomUUID()}.${extension}`;

            // Создаем объект File из blob, чтобы соответствовать типу в сторе
            const newFile = new File([blob], fileName, {
                type: mimeType,
            });

            const url = URL.createObjectURL(newFile);

            videoUrlRef.current = url; // сохраняем новый URL
            videoRef.current.src = url;

            return newFile;
        }
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            console.error(error.message);
            console.error(error.stack);
        }

        throw error;
    } finally {
        setTranscoding(false);
    }
}
