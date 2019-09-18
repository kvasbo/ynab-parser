import React from 'react';
import { connect } from 'react-redux';
// import ReactTable from 'react-table';
import { ParsedDataState } from './redux/reducerParsedData';

interface Props {
    data: ParsedDataState['data'];
}

class ParsedDataTable extends React.PureComponent<{}, {}> {
    render(): JSX.Element {
        return <div></div>;
    }
}

export default connect()(ParsedDataTable);
