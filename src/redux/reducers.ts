import { combineReducers } from 'redux';
import errorMessages, { ErrorMessageState } from './reducerErrorMessage';
import unparsedData, { UnparsedDataState } from './reducerUnparsedData';
import parsedData, { ParsedDataState } from './reducerParsedData';
import parserSettings, { ParserSettingsState } from './reducerParserSettings';
import parserMapping, { ParserMapping } from './reducerParserMapping';

export interface AppState {
    errorMessages: ErrorMessageState;
    unparsedData: UnparsedDataState;
    parsedData: ParsedDataState;
    parserSettings: ParserSettingsState;
    parserMapping: ParserMapping;
}

const reducers = combineReducers({
    errorMessages,
    unparsedData,
    parsedData,
    parserSettings,
    parserMapping,
});

export default reducers;
