import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import parse, { ParsedData } from './parsers/parser';
/**

TODO!
                <textarea
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                        this.parseInput(e.currentTarget.value);
                    }}
                />
 */

interface Props {
    onData: Function;
}

function DropZone(props: Props): JSX.Element {
    const onDrop = useCallback((acceptedFiles): void => {
        const reader = new FileReader();

        reader.onabort = (): void => console.log('file reading was aborted');
        reader.onerror = (): void => console.log('file reading has failed');
        reader.onload = (): void => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            if (typeof binaryStr === 'string') {
                const d: ParsedData = parse(binaryStr);
                props.onData(d);
            }
        };

        acceptedFiles.forEach((file: File): void => reader.readAsBinaryString(file));
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div
            style={{
                height: '20vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(200,150,150)',
            }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
        </div>
    );
}

export default DropZone;
