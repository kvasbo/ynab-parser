import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { AppState } from './redux/reducers';
import { parseNumber } from './parsers/parser';
import ReactTable from 'react-table';
import * as qs from 'query-string';
import Box from './Box';
import Parser from './Parser';
import Input from './Input';
import Filter from './Filter';
import { ParsedDataState } from './redux/reducerParsedData';
import { ParserSettingsState } from './redux/reducerParserSettings';
import { ParserMapping } from './redux/reducerParserMapping';
import './App.css';
import 'react-table/react-table.css';

export interface YnabLine {
    date: string;
    payee: string | null;
    memo: string | null;
    inflow: number | null;
    outflow: number | null;
}

interface Props {
    parsed: ParsedDataState;
    parserSettings: ParserSettingsState;
    parserMapping: ParserMapping;
}

interface State {
    filteredRowsDate: number;
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

//Generate a unique file name based on time
function getTimeBasedFileName(): string {
    const time = Moment().format('YYYYMMDD-HHmmss');
    return `ynab-${time}.csv`;
}

class App extends React.PureComponent<Props, State> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters: Record<string, any> = qs.parse(window.location.search);

    public constructor(props: Props) {
        super(props);
        this.state = {
            filteredRowsDate: 0,
        };
    }

    mapData = (): YnabLine[] => {
        let filteredRowsDate = 0;
        if (!this.props.parsed || !this.props.parsed.data) return [];
        // Filter for cutoff date
        const cutoff = Moment(this.props.parserSettings.cutOffDate);
        const f = this.props.parsed.data.data.filter((l: string[]): boolean => {
            // Date not set, screw it
            if (this.props.parserMapping.date === null) return true;
            const date = Moment(l[this.props.parserMapping.date], this.props.parserSettings.dateFormat);
            if (date.isBefore(cutoff)) {
                filteredRowsDate += 1;
                return false;
            }
            return true;
        });
        this.setState({ filteredRowsDate });
        // Map
        const d = f.map(
            (l: string[]): YnabLine => {
                const date =
                    this.props.parserMapping.date !== null
                        ? Moment(l[this.props.parserMapping.date], this.props.parserSettings.dateFormat).format(
                              'YYYY-MM-DD',
                          )
                        : '';
                let inflow: number | null = null;
                let outflow: number | null = null;
                if (!this.props.parserSettings.singleSumColumn) {
                    // Two separate fields
                    inflow = this.props.parserMapping.inflow ? parseNumber(l[this.props.parserMapping.inflow]) : null;
                    outflow = this.props.parserMapping.outflow
                        ? parseNumber(l[this.props.parserMapping.outflow])
                        : null;
                    if (!inflow) inflow = null;
                    if (!outflow) outflow = null;
                } else {
                    // Put them in a single field
                    const sum = this.props.parserMapping.inflow
                        ? parseNumber(l[this.props.parserMapping.inflow])
                        : null;
                    inflow = sum && sum > 0 ? sum : null;
                    outflow = sum && sum < 0 ? -sum : null;
                }
                return {
                    date,
                    memo: this.props.parserMapping.memo ? l[this.props.parserMapping.memo] : '',
                    payee: this.props.parserMapping.payee ? l[this.props.parserMapping.payee] : '',
                    inflow,
                    outflow,
                };
            },
        );
        return d;
    };

    download = (filename = getTimeBasedFileName()): void => {
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
        // Only render most UI if data present or debug mode.
        const renderTheRest =
            (this.props.parsed.data !== undefined &&
                this.props.parsed.data.data !== undefined &&
                this.props.parsed.data.data.length > 0) ||
            this.parameters.debug;
        return (
            <div className="App" style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                <div>
                    <img src="./logo.svg" style={{ width: '25vw' }} />
                </div>
                <Parser />
                <Box render>
                    <Input />
                </Box>
                <Box render={renderTheRest}>
                    <Filter />
                </Box>
                <Box render={renderTheRest}>{this.state.filteredRowsDate} rows removed due to cutoff date.</Box>
                <Box render={renderTheRest}>
                    <div className="box">
                        <ReactTable
                            style={{ flex: 1 }}
                            defaultPageSize={10}
                            data={this.mapData()}
                            columns={columns}
                            className="-striped -highlight"
                        />
                    </div>
                </Box>
                <Box render={renderTheRest}>
                    <span
                        style={{
                            flex: 1,
                            display: 'flex',
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <button
                            disabled={!renderTheRest}
                            onClick={(): void => this.download()}
                            style={{ fontSize: 20, padding: 30 }}
                        >
                            Download
                        </button>
                    </span>
                </Box>
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
