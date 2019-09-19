import React from 'react';
import { connect } from 'react-redux';
import { AppState } from './redux/reducers';
import { UnparsedDataState } from './redux/reducerUnparsedData';
import Uploader from './Uploader';
import BigNumber from './BigNumber';
import './App.css';

interface Props {
    isActive?: boolean;
    data: UnparsedDataState['data'];
}

class Input extends React.PureComponent<Props, {}> {
    render(): JSX.Element {
        return (
            <div className="box">
                <BigNumber value="1" isActive={this.props.data === undefined} />
                <Uploader isActive={this.props.data === undefined} />
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

export default connect(mapStateToProps)(Input);
