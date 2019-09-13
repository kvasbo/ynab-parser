import React from 'react';
import parseDnb, { ParsedData } from './parsers/parser';
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
        this.state = { parsed: { headers: [], data: [] } };
    }

    private parseInput = (data: string): void => {
        const p = parseDnb(data);
        this.setState({ parsed: p });
    };

    render(): JSX.Element {
        return (
            <div className="App">
                <Uploader
                    onData={(data: ParsedData) => {
                        this.setState({ parsed: data });
                    }}
                />
                <textarea
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        this.parseInput(e.currentTarget.value);
                    }}
                />
                <ReactTable data={this.state.parsed.data} columns={columns} className="-striped -highlight" />
                <span onClick={() => download('ynab.csv')}>download</span>
            </div>
        );
    }
}

export default App;
