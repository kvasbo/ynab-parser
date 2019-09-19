import React from 'react';
import { connect } from 'react-redux';
import { AppState } from './redux/reducers';
import { UnparsedDataState } from './redux/reducerUnparsedData';
import { ParsedDataState } from './redux/reducerParsedData';
import { ParserSettingsState } from './redux/reducerParserSettings';
import { ParserMapping } from './redux/reducerParserMapping';
import { changeParserSetting, changeParserMapping } from './redux/actions';
import BigNumber from './BigNumber';
import './App.css';

interface Props {
    parsed: ParsedDataState['data'];
    parserSettings: ParserSettingsState;
    parserMapping: ParserMapping;
    unparsedData: UnparsedDataState['data'];
    dispatch: Function;
}

class Filter extends React.PureComponent<Props, {}> {
    getSelectBoxFiller = (): JSX.Element[] => {
        const out = [];
        if (this.props.parserSettings.useHeader && this.props.parsed && this.props.parsed.headers) {
            this.props.parsed.headers.forEach((h, i): void => {
                out.push(
                    <option key={i} value={i}>
                        {h}
                    </option>,
                );
            });
        }
        out.push(
            <option key="nada" value={-1}>
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

    render(): JSX.Element {
        return (
            <div className="box">
                <div>
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
                    <span>
                        <label htmlFor="date">Date field</label>
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                this.props.dispatch(changeParserMapping('date', Number(e.currentTarget.value)));
                            }}
                            id="date"
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
                </div>
                <BigNumber value="2" isActive />
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
    };
}

export default connect(mapStateToProps)(Filter);
