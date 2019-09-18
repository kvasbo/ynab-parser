import { ErrorMessage } from './reducerErrorMessage';
import { UnparsedData } from './reducerUnparsedData';
import { ParsedData } from '../parsers/parser';

export const ADD_ERROR = 'ADD_ERROR';
export const ADD_UNPARSED_DATA = 'ADD_UNPARSED_DATA';
export const ADD_PARSED_DATA = 'ADD_PARSED_DATA';

export interface ErrorMessageAction {
    type: typeof ADD_ERROR;
    error: ErrorMessage;
}

export interface UnparsedDataAction {
    type: typeof ADD_UNPARSED_DATA;
    data: UnparsedData;
}

export interface ParsedDataAction {
    type: typeof ADD_PARSED_DATA;
    data: ParsedData;
}

export function addError(error: ErrorMessage): ErrorMessageAction {
    return {
        type: ADD_ERROR,
        error,
    };
}

export function addUnparsedData(data: UnparsedData): UnparsedDataAction {
    return {
        type: ADD_UNPARSED_DATA,
        data,
    };
}

export function addParsedData(data: ParsedData): ParsedDataAction {
    return {
        type: ADD_PARSED_DATA,
        data,
    };
}
