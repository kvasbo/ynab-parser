import { ErrorMessage } from './reducerErrorMessage';

export const ADD_ERROR = 'ADD_ERROR';

export interface ErrorMessageAction {
    type: typeof ADD_ERROR;
    error: ErrorMessage;
}

export function addError(error: ErrorMessage): ErrorMessageAction {
    return {
        type: ADD_ERROR,
        error,
    };
}
