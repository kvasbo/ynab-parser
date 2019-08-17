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

function download(filename: string, data: YnabLine[]) {
  const element = document.createElement('a');
  const text="Test nummer to"
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

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
        <p>
          <textarea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> {this.parseInput(e.currentTarget.value);}} />
        </p>
        <ReactTable
          data={this.state.parsed}
          columns={columns}
          className="-striped -highlight"
        />
        <span onClick={() => download('ynab.csv', this.state.parsed)} >download</span>
      </div>
    );
  }
  
}

export default App;
