import React from 'react';
import { connect } from 'react-redux';
import { AppState } from './redux/reducers';
import { addParsedData } from './redux/actions';
import { UnparsedDataState } from './redux/reducerUnparsedData';
import parse from './parsers/parser';

interface Props {
    data: UnparsedDataState['data'];
    dispatch: Function;
}

// Will do the actual parsing! Bit of a hack keeping it in its own component, but hey.
class Parser extends React.PureComponent<Props, {}> {
    UNSAFE_componentWillReceiveProps(props: Props): void {
        if (props.data) {
            const parsedData = parse(props.data);
            this.props.dispatch(addParsedData(parsedData));
        }
    }

    render(): JSX.Element {
        return <div />;
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function mapStateToProps(state: AppState) {
    return {
        data: state.unparsedData.data,
    };
}

export default connect(mapStateToProps)(Parser);
