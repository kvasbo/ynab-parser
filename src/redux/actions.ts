import { ErrorMessage } from './reducerErrorMessage';
import { UnparsedData } from './reducerUnparsedData';

export const ADD_ERROR = 'ADD_ERROR';
export const ADD_UNPARSED_DATA = 'ADD_UNPARSED_DATA';

export interface ErrorMessageAction {
    type: typeof ADD_ERROR;
    error: ErrorMessage;
}

export interface UnparsedDataAction {
    type: typeof ADD_UNPARSED_DATA;
    data: UnparsedData;
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
