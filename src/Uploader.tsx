import React from 'react';
import { connect } from 'react-redux';
import { AppState } from './redux/reducers';
import { addUnparsedData } from './redux/actions';
import { UnparsedDataState } from './redux/reducerUnparsedData';

interface Props {
    dispatch: Function;
    data: UnparsedDataState['data'];
    isActive?: boolean;
}

class DropZone extends React.Component<Props, {}> {
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

    // File dropped
    onDrop = (e: React.DragEvent<HTMLTextAreaElement>): void => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        this.getFileReader().readAsText(file);
    };

    // File uploaded via button
    openFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (!e.target || !e.target.files || !e.target.files[0]) {
            return;
        }
        const file = e.target.files[0];
        this.getFileReader().readAsText(file);
    };

    // Create the file reader object
    getFileReader = (): FileReader => {
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
        return reader;
    };

    onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const newValue = e.target.value;
        this.props.dispatch(addUnparsedData(newValue));
    };

    doClear = (): void => {
        this.props.dispatch(addUnparsedData(''));
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
                    rows={10}
                    ref={this.textArea}
                    placeholder="Drag and drop a file here, click button to select a file, or paste csv(ish) data."
                    onChange={this.onTextChange}
                    onDragOver={this.onDragOver}
                    onDragEnd={this.onDragEnd}
                    onDrop={this.onDrop}
                    value={this.props.data}
                ></textarea>
                <button onClick={this.doClear}>Clear data</button>
                <input type="file" accept="text/*, .csv, .tsv" onChange={this.openFile} />
            </div>
        );
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function mapStateToProps(state: AppState) {
    return {
        data: state.unparsedData.data,
    };
}

export default connect(mapStateToProps)(DropZone);
