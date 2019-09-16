import { ADD_ERROR, ErrorMessageAction } from './actions';

export type ErrorMessageCategories = 'debug' | 'info' | 'warning' | 'error';

export interface ErrorMessage {
    category: ErrorMessageCategories;
    message: string;
}

export interface ErrorMessageState {
    errors: ErrorMessage[];
}

const intialState = {
    errors: [],
};

export default function errorMessageStore(
    state: ErrorMessageState = intialState,
    action: ErrorMessageAction,
): ErrorMessageState {
    switch (action.type) {
        case ADD_ERROR: {
            return { errors: [action.error, ...state.errors] };
        }
        default:
            return state;
    }
}
