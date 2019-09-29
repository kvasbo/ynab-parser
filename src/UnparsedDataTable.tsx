import React from 'react';
import { connect } from 'react-redux';
import { AppState } from './redux/reducers';
import { addUnparsedData } from './redux/actions';
import { UnparsedDataState } from './redux/reducerUnparsedData';
import './App.css';

interface Props {
    data: UnparsedDataState['data'];
    dispatch: Function;
}

class UnparsedDataTable extends React.PureComponent<Props, {}> {
    valueChanged = (value: string): void => {
        this.props.dispatch(addUnparsedData(value));
    };

    render(): JSX.Element {
        return (
            <div
                className="box"
                style={{
                    fontFamily:
                        'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace',
                }}
            >
                <textarea
                    rows={8}
                    style={{ flex: 1 }}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
                        this.valueChanged(event.target.value);
                    }}
                    value={this.props.data}
                ></textarea>
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

export default connect(mapStateToProps)(UnparsedDataTable);
