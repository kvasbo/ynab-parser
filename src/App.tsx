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
    },
    {
        accessor: 'outflow',
        Header: 'Outflow',
    },
];

function download(filename: string): void {
    const element = document.createElement('a');
    const text = 'Test nummer to';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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

    mapData = (data: ParsedData['data']): YnabLine[] => {
        const d = data.map(
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

    render(): JSX.Element {
        return (
            <div className="App">
                <Uploader
                    onData={(data: ParsedData): void => {
                        this.setState({ parsed: data });
                    }}
                />
                <ReactTable
                    data={this.mapData(this.state.parsed.data)}
                    //resolveData={data => this.mapData(data)}
                    columns={columns}
                    className="-striped -highlight"
                />
                <span onClick={(): void => download('ynab.csv')}>download</span>
            </div>
        );
    }
}

export default App;
