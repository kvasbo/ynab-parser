import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import { AppState } from './redux/reducers';
import { UnparsedDataState } from './redux/reducerUnparsedData';
import { ParsedDataState } from './redux/reducerParsedData';
import { ParserSettingsState } from './redux/reducerParserSettings';
import { ParserMapping } from './redux/reducerParserMapping';
import { changeParserSetting, changeParserMapping } from './redux/actions';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
    parsed: ParsedDataState['data'];
    parserSettings: ParserSettingsState;
    parserMapping: ParserMapping;
    parserMappingGuesses: ParserMapping;
    unparsedData: UnparsedDataState['data'];
    dispatch: Function;
}

class Filter extends React.PureComponent<Props, {}> {
    getSelectBoxFiller = (): JSX.Element[] => {
        const out = [];
        out.push(
            <option key="nada" value={-1}>
                -
            </option>,
        );
        if (this.props.parserSettings.useHeader && this.props.parsed && this.props.parsed.headers) {
            this.props.parsed.headers.forEach((h, i): void => {
                out.push(
                    <option key={i} value={i}>
                        {h}
                    </option>,
                );
            });
        }
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

    handleCutoffChange(d: Date | null): void {
        if (!d) return;
        this.props.dispatch(changeParserSetting('cutOffDate', d));
    }

    applyMagic = (): void => {
        // Magic button pressed!
        if (this.props.parserMappingGuesses.date !== null) {
            this.props.dispatch(changeParserMapping('date', this.props.parserMappingGuesses.date));
        }
        if (this.props.parserMappingGuesses.inflow !== null) {
            this.props.dispatch(changeParserMapping('inflow', this.props.parserMappingGuesses.inflow));
        }
        if (this.props.parserMappingGuesses.outflow !== null) {
            this.props.dispatch(changeParserMapping('outflow', this.props.parserMappingGuesses.outflow));
        }
        if (this.props.parserMappingGuesses.memo !== null) {
            this.props.dispatch(changeParserMapping('memo', this.props.parserMappingGuesses.memo));
        }
        if (this.props.parserMappingGuesses.payee !== null) {
            this.props.dispatch(changeParserMapping('payee', this.props.parserMappingGuesses.payee));
        }
    };

    render(): JSX.Element {
        return (
            <div className="box" style={{ flexDirection: 'row' }}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <span>
                        <label htmlFor="dateFormat">Date Format</label>
                        <select
                            value={this.props.parserSettings.dateFormat}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                this.props.dispatch(changeParserSetting('dateFormat', e.currentTarget.value));
                            }}
                            id="dateFormat"
                        >
                            {this.getDateFormats()}
                        </select>
                    </span>
                    <span style={{ display: 'flex', flex: 1 }}>
                        <label htmlFor="cutoffDate">Cutoff date</label>
                        <br />
                        <DatePicker
                            id="cutoffDate"
                            selected={Moment(this.props.parserSettings.cutOffDate).toDate()}
                            onChange={(d): void => {
                                this.handleCutoffChange(d);
                            }}
                        />
                    </span>
                    <span>
                        <label htmlFor="date">Date field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                this.props.dispatch(changeParserMapping('date', Number(e.currentTarget.value)));
                            }}
                            id="date"
                            value={this.props.parserMapping.date !== null ? this.props.parserMapping.date : -1}
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="payee">Payee field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                this.props.dispatch(changeParserMapping('payee', Number(e.currentTarget.value)));
                            }}
                            id="payee"
                            value={this.props.parserMapping.memo !== null ? this.props.parserMapping.memo : -1}
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="memo">Memo field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                this.props.dispatch(changeParserMapping('memo', Number(e.currentTarget.value)));
                            }}
                            id="memo"
                            value={this.props.parserMapping.memo !== null ? this.props.parserMapping.memo : -1}
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="inflow">Inflow field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                this.props.dispatch(changeParserMapping('inflow', Number(e.currentTarget.value)));
                            }}
                            id="inflow"
                            value={this.props.parserMapping.inflow !== null ? this.props.parserMapping.inflow : -1}
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <label htmlFor="outflow">Outflow field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                this.props.dispatch(changeParserMapping('outflow', Number(e.currentTarget.value)));
                            }}
                            id="outflow"
                            value={this.props.parserMapping.outflow !== null ? this.props.parserMapping.outflow : -1}
                        >
                            {this.getSelectBoxFiller()}
                        </select>
                    </span>
                    <span>
                        <input
                            type="checkbox"
                            id="checkSingleSumField"
                            checked={this.props.parserSettings.singleSumColumn}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                this.props.dispatch(changeParserSetting('singleSumColumn', e.currentTarget.checked));
                            }}
                        />
                        <label htmlFor="checkSingleSumField">In/outflow is same field</label>
                    </span>
                    <span>
                        <button onClick={this.applyMagic}>Magic!</button>
                    </span>
                </div>
            </div>
        );
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function mapStateToProps(state: AppState) {
    return {
        unparsedData: state.unparsedData.data,
        parsed: state.parsedData.data,
        parserSettings: state.parserSettings,
        parserMapping: state.parserMapping,
        parserMappingGuesses: state.parserMappingGuesses,
    };
}

export default connect(mapStateToProps)(Filter);
