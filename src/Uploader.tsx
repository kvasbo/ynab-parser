import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
    onData: Function;
}

function DropZone(props: Props): JSX.Element {
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            console.log(binaryStr);
        };

        acceptedFiles.forEach((file: File) => reader.readAsBinaryString(file));
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
        </div>
    );
}

export default DropZone;
