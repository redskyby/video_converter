'use client'


import React, {useEffect, useRef, useState} from "react";
import {Button, Input, Spinner} from "@heroui/react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const Header = () => {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    const [loader, setLoader] = useState<boolean>(true);
    const [transcoding, setTranscoding] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const loadFFmpeg = async () => {
            try {
                const ffmpeg = new FFmpeg();
                ffmpegRef.current = ffmpeg;

                ffmpeg.on('log', ({ message }) => {
                    if (messageRef.current) messageRef.current.innerHTML = message;
                    console.log(message);
                });

                const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
                });

                console.log('FFmpeg готов к работе');
            } catch (error) {
                console.error('Ошибка загрузки ffmpeg:', error);
            } finally {
                setLoader(false);
            }
        };

        loadFFmpeg();
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const transcode = async (fileToTranscode: File | null) => {
        try {
            setTranscoding(true);

            const ffmpeg = ffmpegRef.current;
            if (!fileToTranscode) {
                return;
            }

            await ffmpeg?.writeFile(
                fileToTranscode.name,
                await fetchFile(fileToTranscode)
            );

            await ffmpeg?.exec([
                "-i", fileToTranscode.name,
                "-preset", "ultrafast",
                "-crf", "28",
                "-vf", "hflip",
                "-threads", "0",
                "output.mp4"
            ]);

            const data = (await ffmpeg?.readFile("output.mp4")) as any;

            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(
                    new Blob([data.buffer], { type: "video/mp4" })
                );
            }
        } catch (error) {
            console.error("Ошибка во время конвертации:", error);
            if (messageRef.current) {
                messageRef.current.innerHTML = "Произошла ошибка. Попробуйте другой файл.";
            }
        } finally {
            setTranscoding(false);
        }
    }

    if(loader) {
        return (
            <div className="flex items-center gap-4">
                <Spinner/>
                <p>Загрузка FFmpeg...</p>
            </div>
        );
    }

    return (
        <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-2 p-4 space-y-4"}>
            <h1 className="text-xl font-bold">Video converter</h1>
            <Input aria-label="File" type="file" onChange={handleFileChange} className="w-64" />
            <div className="flex items-center gap-4">
                <Button onClick={() => transcode(file)} >
                    конвертировать
                </Button>
                {transcoding && <Spinner/>}
            </div>
            
            <p ref={messageRef} className="text-gray-500 text-sm font-mono bg-gray-100 p-2 rounded"></p>
            
            <video ref={videoRef} controls className="w-full max-w-2xl"></video>
        </div>
    );
};

export default Header;
