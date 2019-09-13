import React from 'react';
import Moment from 'moment';
import { ParsedData, parseNumber } from './parsers/parser';
import ReactTable from 'react-table';
import Uploader from './Uploader';
import './App.css';
import 'react-table/react-table.css';

export interface YnabLine {
    date: string;
    payee: string;
    memo: string;
    inflow: number | null;
    outflow: number | null;
}

interface AppState {
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

function convertToCSV(objArray: YnabLine[]): string {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += ',';
            line += `"${array[i][index]}"`;
        }

        str += line + '\r\n';
    }
    return str;
}

class App extends React.PureComponent<{}, AppState> {
    public constructor(props: {}) {
        super(props);
        this.state = {
            parsed: { headers: [], data: [] },
            useHeaders: true,
            mapping: { date: 0, payee: 1, memo: 2, inflow: 3, outflow: 4 },
            dateFormat: 'DD.MM.YYYY',
        };
    }

    mapData = (): YnabLine[] => {
        const d = this.state.parsed.data.map(
            (l: string[]): YnabLine => {
                const date = Moment(l[this.state.mapping.date], this.state.dateFormat).format('YYYY-MM-DD');
                return {
                    date,
                    memo: l[this.state.mapping.memo],
                    payee: l[this.state.mapping.payee],
                    inflow: parseNumber(l[this.state.mapping.inflow]),
                    outflow: parseNumber(l[this.state.mapping.outflow]),
                };
            },
        );
        return d;
    };

    download = (filename: string = 'ynab.csv'): void => {
        const element = document.createElement('a');
        let text = `"Date","Payee","Memo","Outflow","Inflow"\r\n`;
        text += convertToCSV(this.mapData());
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
                <Uploader
                    onData={(data: ParsedData): void => {
                        this.setState({ parsed: data });
                    }}
                />
                <div
                    className="filter"
                    style={{ display: 'flex', margin: 20, justifyContent: 'space-evenly', alignItems: 'center' }}
                >
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
                    <button onClick={(): void => this.download()}>Download</button>
                </div>
                <ReactTable data={this.mapData()} columns={columns} className="-striped -highlight" />
            </div>
        );
    }
}

export default App;
