import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { addUnparsedData, addError } from './redux/actions';

interface Props {
    dispatch: Function;
    isActive?: boolean;
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
                            height: '15vh',
                            width: '80vw',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgb(240,240,240)',
                            borderRadius: '1vw',
                        }}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        <p>Drag and drop some files here, or click to select.</p>
                    </div>
                </section>
            )}
        </Dropzone>
    );
}

export default connect()(DropZone);
