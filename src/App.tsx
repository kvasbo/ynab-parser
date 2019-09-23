import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { AppState } from './redux/reducers';
import { parseNumber } from './parsers/parser';
import ReactTable from 'react-table';
import Parser from './Parser';
import Input from './Input';
import Filter from './Filter';
import { ParsedDataState } from './redux/reducerParsedData';
import { ParserSettingsState } from './redux/reducerParserSettings';
import { ParserMapping } from './redux/reducerParserMapping';
import UnparsedDataTable from './UnparsedDataTable';
import './App.css';
import 'react-table/react-table.css';

export interface YnabLine {
    date: string;
    payee: string;
    memo: string;
    inflow: number | null;
    outflow: number | null;
}

interface Props {
    parsed: ParsedDataState;
    parserSettings: ParserSettingsState;
    parserMapping: ParserMapping;
}

const columns = [
    {
        Header: 'Date',
        accessor: 'date', // String-based value accessors!
        width: 125,
    },
    {
        Header: 'Payee',
        accessor: 'payee',
    },
    {
        accessor: 'memo', // Required because our accessor is not a string
        Header: 'Memo',
    },
    {
        accessor: 'inflow',
        Header: 'Inflow',
        width: 125,
    },
    {
        accessor: 'outflow',
        Header: 'Outflow',
        width: 125,
    },
];

class App extends React.PureComponent<Props, {}> {
    public constructor(props: Props) {
        super(props);
    }

    mapData = (): YnabLine[] => {
        if (!this.props.parsed || !this.props.parsed.data) return [];
        // Filter
        const cutoff = Moment(this.props.parserSettings.cutOffDate, 'YYYY-MM-DD');
        const f = this.props.parsed.data.data.filter((l: string[]): boolean => {
            const date = Moment(l[this.props.parserMapping.date], this.props.parserSettings.dateFormat);
            if (date.isBefore(cutoff)) return false;
            return true;
        });
        // Map
        const d = f.map(
            (l: string[]): YnabLine => {
                const date = Moment(l[this.props.parserMapping.date], this.props.parserSettings.dateFormat).format(
                    'YYYY-MM-DD',
                );
                let inflow: number | null = null;
                let outflow: number | null = null;
                if (!this.props.parserSettings.singleSumColumn) {
                    // Two separate fields
                    inflow = parseNumber(l[this.props.parserMapping.inflow]);
                    outflow = parseNumber(l[this.props.parserMapping.outflow]);
                    if (isNaN(inflow)) inflow = null;
                    if (isNaN(outflow)) outflow = null;
                } else {
                    // Put them in a single field
                    const sum = parseNumber(l[this.props.parserMapping.inflow]);
                    inflow = !isNaN(sum) && sum > 0 ? sum : null;
                    outflow = !isNaN(sum) && sum < 0 ? -sum : null;
                }
                return {
                    date,
                    memo: l[this.props.parserMapping.memo],
                    payee: l[this.props.parserMapping.payee],
                    inflow,
                    outflow,
                };
            },
        );
        return d;
    };

    download = (filename = 'ynab.csv'): void => {
        const separator = ',';
        const newLine = '\r\n';
        const element = document.createElement('a');
        let text = `"Date"${separator}"Payee"${separator}"Memo"${separator}"Outflow"${separator}"Inflow"${newLine}`;
        const data = this.mapData();
        data.forEach((d): void => {
            const date = `"${d.date}"`;
            const memo = d.memo ? `"${d.memo}"` : '';
            const payee = d.payee ? `"${d.payee}"` : '';
            const inflow = d.inflow ? `"${d.inflow}"` : '';
            const outflow = d.outflow ? `"${d.outflow}"` : '';
            const line = `${date}${separator}${payee}${separator}${memo}${separator}${outflow}${separator}${inflow}${newLine}`;
            text += line;
        });
        //        text += convertToCSV(this.mapData());
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    render(): JSX.Element {
        return (
            <div className="App" style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                <div className="box" style={{ flex: 0.5 }}>
                    <Input />
                </div>
                <div className="box" style={{ flex: 0.5 }}>
                    <Parser />
                </div>
                <div className="box" style={{ flex: 0.5 }}>
                    <Filter />
                </div>
                <div className="box" style={{ flex: 0.5 }}>
                    <button onClick={(): void => this.download()}>Download</button>
                </div>
                <div className="box" style={{ flex: 0.5 }}>
                    <UnparsedDataTable />
                </div>
                <div className="box" style={{ flex: 1 }}>
                    <ReactTable
                        style={{ flex: 1 }}
                        data={this.mapData()}
                        columns={columns}
                        className="-striped -highlight"
                    />
                </div>
            </div>
        );
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function mapStateToProps(state: AppState) {
    return {
        parsed: state.parsedData,
        parserMapping: state.parserMapping,
        parserSettings: state.parserSettings,
    };
}

export default connect(mapStateToProps)(App);
