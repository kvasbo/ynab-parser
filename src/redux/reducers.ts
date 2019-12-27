import { combineReducers } from 'redux';
import errorMessages, { ErrorMessageState } from './reducerErrorMessage';
import unparsedData, { UnparsedDataState } from './reducerUnparsedData';
import parsedData, { ParsedDataState } from './reducerParsedData';
import parserSettings, { ParserSettingsState } from './reducerParserSettings';
import parserMapping, { ParserMapping } from './reducerParserMapping';
import parserMappingGuesses from './reducerParserMappingGuesses';

export interface AppState {
    errorMessages: ErrorMessageState;
    unparsedData: UnparsedDataState;
    parsedData: ParsedDataState;
    parserSettings: ParserSettingsState;
    parserMapping: ParserMapping;
    parserMappingGuesses: ParserMapping;
}

const reducers = combineReducers({
    errorMessages,
    unparsedData,
    parsedData,
    parserSettings,
    parserMapping,
    parserMappingGuesses,
});

export default reducers;
