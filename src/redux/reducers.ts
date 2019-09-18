import { combineReducers } from 'redux';
import errorMessages, { ErrorMessageState } from './reducerErrorMessage';
import unparsedData, { UnparsedDataState } from './reducerUnparsedData';
import parsedData, { ParsedDataState } from './reducerParsedData';

export interface AppState {
    errorMessages: ErrorMessageState;
    unparsedData: UnparsedDataState;
    parsedData: ParsedDataState;
}

const reducers = combineReducers({
    errorMessages,
    unparsedData,
    parsedData,
});

export default reducers;
