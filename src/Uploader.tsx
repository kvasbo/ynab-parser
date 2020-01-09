import React from 'react';
import { connect } from 'react-redux';
// import Dropzone from 'react-dropzone';
import { addUnparsedData } from './redux/actions';

interface Props {
    dispatch: Function;
    isActive?: boolean;
}

class DropZone extends React.PureComponent<Props, {}> {
    textArea: React.RefObject<HTMLTextAreaElement>;

    constructor(props: Props) {
        super(props);
        this.textArea = React.createRef();
    }

    onDragOver = (): void => {
        //TODO Style change
        // e: React.DragEvent<HTMLTextAreaElement>
    };

    onDragEnd = (): void => {
        console.log('Drag end');
    };

    onDrop = (e: React.DragEvent<HTMLTextAreaElement>): void => {
        e.preventDefault();
        if (typeof window.FileReader === 'undefined') {
            alert('File upload not supported');
            return;
        }
        const reader = new FileReader();
        reader.onload = (): void => {
            const binaryStr = reader.result;
            if (typeof binaryStr === 'string') {
                this.props.dispatch(addUnparsedData(binaryStr));
                // console.log(binaryStr);
            } else {
                alert('Could not read file as text');
            }
        };
        const file = e.dataTransfer.files[0];
        reader.readAsText(file);
    };

    onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const newValue = e.target.value;
        this.props.dispatch(addUnparsedData(newValue));
    };

    render(): JSX.Element {
        //  No file reader, give up
        if (typeof window.FileReader === 'undefined') {
            return <div>File upload not supported</div>;
        }

        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                <textarea
                    style={{ display: 'flex', flex: 1, borderRadius: 5, borderColor: '#AAAAAA' }}
                    ref={this.textArea}
                    placeholder="Drag and drop a file here, click button to select a file, or paste csv(ish) data."
                    onChange={this.onTextChange}
                    onDragOver={this.onDragOver}
                    onDragEnd={this.onDragEnd}
                    onDrop={this.onDrop}
                ></textarea>
            </div>
        );
    }
}

export default connect()(DropZone);

/*

                <Dropzone onDrop={(acceptedFiles): void => this.onFiles(acceptedFiles)}>
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
                                <p>Drag and drop some files here, click to select a file, or paste data below.</p>
                            </div>
                        </section>
                    )}
                </Dropzone>

                */
