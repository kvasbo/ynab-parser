import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import parse, { ParsedData } from './parsers/parser';
import { addUnparsedData, addError } from './redux/actions';
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
    dispatch: Function;
}

function DropZone(props: Props): JSX.Element {
    const onFiles = (acceptedFiles: File[]): void => {
        const reader = new FileReader();
        reader.onabort = (): void => props.dispatch(addError({ category: 'error', message: 'File load aborted' }));
        reader.onerror = (): void =>
            props.dispatch(addError({ category: 'error', message: 'File reading has failed' }));
        reader.onload = (): void => {
            // Do whatever you want with the file contents
            const binaryStr = reader.result;
            if (typeof binaryStr === 'string') {
                props.dispatch(addUnparsedData(binaryStr));
                const d: ParsedData = parse(binaryStr);
                props.onData(d);
            }
        };
        acceptedFiles.forEach((file: File): void => reader.readAsBinaryString(file));
    };

    return (
        <Dropzone onDrop={(acceptedFiles): void => onFiles(acceptedFiles)}>
            {({ getRootProps, getInputProps }): JSX.Element => (
                <section>
                    <div
                        style={{
                            height: '20vh',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgb(225,220,220)',
                        }}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <p>Drag and drop some files here, or click to select files</p>
                    </div>
                </section>
            )}
        </Dropzone>
    );
}

export default connect()(DropZone);
