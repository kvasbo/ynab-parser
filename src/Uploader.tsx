import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import parse, { ParsedData } from './parsers/parser';
import { YnabLine } from './App';

interface Props {
    onData: Function;
}

function DropZone(props: Props): JSX.Element {
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.onabort = (): void => console.log('file reading was aborted');
        reader.onerror = (): void => console.log('file reading has failed');
        reader.onload = (): void => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            if (typeof binaryStr === 'string') {
                const d: ParsedData = parse(binaryStr);
                console.log(d);
            }
        };

        acceptedFiles.forEach((file: File) => reader.readAsBinaryString(file));
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
        </div>
    );
}

export default DropZone;
