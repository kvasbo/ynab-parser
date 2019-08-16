import React from 'react';
import parseDnb from './parsers/parser.dnb';
import ReactTable from 'react-table'
import './App.css';
import "react-table/react-table.css";

export interface YnabLine {
  date: string;
  payee: string;
  memo: string;
  inflow: number | null;
  outflow: number | null;
}

interface AppState {
  unparsed: string;
  parsed: YnabLine[];
}

const columns = [{
  Header: 'Date',
  accessor: 'date' // String-based value accessors!
}, {
  Header: 'Payee',
  accessor: 'payee',
}, {
  accessor: 'memo', // Required because our accessor is not a string
  Header: 'Memo',
}, {
  accessor: 'inflow', 
  Header: 'Inflow'
}, {
  accessor: 'outflow', 
  Header: 'Outflow'
}]

class App extends React.PureComponent<{}, AppState> {
  public constructor(props: {}) {
    super(props);
    this.state = { unparsed: "", parsed: [] } 
  }

  private parseInput = (data: string) => {
    const p = parseDnb(data);
    this.setState({ parsed: p });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            <textarea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> {this.parseInput(e.currentTarget.value);}} />
          </p>
          <ReactTable
            data={this.state.parsed}
            columns={columns}
            className="-striped -highlight"
          />
        </header>
      </div>
    );
  }
  
}

export default App;
