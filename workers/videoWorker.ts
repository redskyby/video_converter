// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile } from "@ffmpeg/util";
//
// const ffmpeg = new FFmpeg();
//
// let loaded = false;
//
// self.onmessage = async (event: MessageEvent) => {
//     const { file } = event.data;
//
//     try {
//         if (!loaded) {
//             const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
//             const ffmpeg = ffmpegRef.current;
//
//             loaded = true;
//         }
//
//         // progress
//         ffmpeg.on("progress", ({ progress }) => {
//             self.postMessage({ type: "progress", progress });
//         });
//
//         // записываем файл в виртуальную FS
//         await ffmpeg.writeFile("input.mp4", await fetchFile(file));
//
//         // конвертация
//         await ffmpeg.exec([
//             "-i",
//             "input.mp4",
//             "-c:v",
//             "libvpx",
//             "-b:v",
//             "1M",
//             "output.webm",
//         ]);
//
//         // читаем результат
//         const data = await ffmpeg.readFile("output.webm");
//
//         // @ts-ignore
//         const blob = new Blob([data.buffer], { type: "video/webm" });
//
//         self.postMessage({ type: "done", blob });
//
//     } catch (err) {
//         self.postMessage({ type: "error", error: String(err) });
//     }
// };
