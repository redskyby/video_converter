"use client"
import {useEffect, useRef, useState} from "react";
import {Button} from "@heroui/react";

const Header = () => {
    const workerRef = useRef(null);
    const [result, setResult] = useState(null)


    useEffect(()=>{
        // @ts-ignore
        workerRef.current = new Worker("/videoWorker.js")


        // @ts-ignore
        workerRef.current.onmessage = (event) => {
            const { result } = event.data;
            setResult(result)
        }

        return()=>{
            // @ts-ignore
            workerRef.current.terminate();
        }

    },[])


    const runWorker = () => {
        // @ts-ignore
        workerRef.current.postMessage({value: 10})
    }

    return (
        <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-2"}>
            <h1>Video converter</h1>
            <Button onClick={runWorker}>Запустить воркер</Button>
            {result && <p>{result}</p>}
        </div>
    );
};

export default Header;