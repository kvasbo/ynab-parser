import React from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { AppState } from './redux/reducers';
import { ParsedData, parseNumber } from './parsers/parser';
import ReactTable from 'react-table';
import Uploader from './Uploader';
import Parser from './Parser';

import UnparsedDataTable from './UnparsedDataTable';
import './App.css';
import 'react-table/react-table.css';
import { ParsedDataState } from './redux/reducerParsedData';

export interface YnabLine {
    date: string;
    payee: string;
    memo: string;
    inflow: number | null;
    outflow: number | null;
}

interface State {
    parsed: ParsedData;
    useHeaders: boolean;
    mapping: {
        date: number;
        memo: number;
        payee: number;
        inflow: number;
        outflow: number;
    };
    dateFormat: string;
    singleSumField: boolean;
}

interface Props {
    parsed: ParsedDataState;
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

class App extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            parsed: { headers: [], data: [] },
            useHeaders: true,
            mapping: { date: 0, payee: 1, memo: 2, inflow: 3, outflow: 4 },
            dateFormat: 'DD.MM.YYYY',
            singleSumField: false,
        };
    }

    mapData = (): YnabLine[] => {
        if (!this.props.parsed || !this.props.parsed.data) return [];
        const d = this.props.parsed.data.data.map(
            (l: string[]): YnabLine => {
                const date = Moment(l[this.state.mapping.date], this.state.dateFormat).format('YYYY-MM-DD');
                let inflow: number | null = null;
                let outflow: number | null = null;
                if (!this.state.singleSumField) {
                    // Two separate fields
                    inflow = parseNumber(l[this.state.mapping.inflow]);
                    outflow = parseNumber(l[this.state.mapping.outflow]);
                    if (isNaN(inflow)) inflow = null;
                    if (isNaN(outflow)) outflow = null;
                } else {
                    // Put them in a single field
                    const sum = parseNumber(l[this.state.mapping.inflow]);
                    inflow = !isNaN(sum) && sum > 0 ? sum : null;
                    outflow = !isNaN(sum) && sum < 0 ? -sum : null;
                }
                return {
                    date,
                    memo: l[this.state.mapping.memo],
                    payee: l[this.state.mapping.payee],
                    inflow,
                    outflow,
                };
            },
        );
        return d;
    };

    getSelectBoxFiller = (): JSX.Element[] => {
        const out = [];
        if (this.state.useHeaders) {
            this.state.parsed.headers.forEach((h, i): void => {
                out.push(
                    <option key={i} value={i}>
                        {h}
                    </option>,
                );
            });
        }
        out.push(
            <option key="nada" value="-1">
                -
            </option>,
        );
        return out;
    };

    getDateFormats = (): JSX.Element[] => {
        //const out: JSX.Element[] = [];
        const formats = ['YYYY-MM-DD', 'DD.MM.YYYY', 'MM.DD.YYYY'];
        const out = formats.map(f => {
            return (
                <option key={f} value={f}>
                    {f}
                </option>
            );
        });
        return out;
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
            <div className="App">
                <Uploader />
                <Parser />
                <div
                    className="filter"
                    style={{ display: 'flex', margin: 20, justifyContent: 'space-evenly', alignItems: 'center' }}
                >
                    {false && (
                        <span>
                            <input
                                type="checkbox"
                                id="checkUseHeaders"
                                checked={this.state.useHeaders}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                    this.setState({ useHeaders: e.currentTarget.checked })
                                }
                            />
                            <label htmlFor="checkUseHeaders">Use headers</label>
                        </span>
                    )}
                    <span>
                        <label htmlFor="dateFormat">Date Format</label>
                        <select
                            value={this.state.dateFormat}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                                this.setState({
                                    dateFormat: e.currentTarget.value,
                                })
                            }
                            id="dateFormat"
                        >
                            {this.getDateFormats()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="date">Date field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                                this.setState({
                                    mapping: { ...this.state.mapping, date: Number(e.currentTarget.value) },
                                })
                            }
                            id="date"
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="payee">Payee field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                                this.setState({
                                    mapping: { ...this.state.mapping, payee: Number(e.currentTarget.value) },
                                })
                            }
                            id="payee"
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="memo">Memo field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                                this.setState({
                                    mapping: { ...this.state.mapping, memo: Number(e.currentTarget.value) },
                                })
                            }
                            id="memo"
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="inflow">Inflow field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                                this.setState({
                                    mapping: { ...this.state.mapping, inflow: Number(e.currentTarget.value) },
                                })
                            }
                            id="inflow"
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="outflow">Outflow field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                                this.setState({
                                    mapping: { ...this.state.mapping, outflow: Number(e.currentTarget.value) },
                                })
                            }
                            id="outflow"
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <input
                            type="checkbox"
                            id="checkSingleSumField"
                            checked={this.state.singleSumField}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                this.setState({ singleSumField: e.currentTarget.checked })
                            }
                        />
                        <label htmlFor="checkSingleSumField">In/outflow is same field</label>
                    </span>
                    <button onClick={(): void => this.download()}>Download</button>
                </div>
                <UnparsedDataTable />
                <ReactTable data={this.mapData()} columns={columns} className="-striped -highlight" />
            </div>
        );
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function mapStateToProps(state: AppState) {
    return {
        parsed: state.parsedData,
    };
}

export default connect(mapStateToProps)(App);
