import { ADD_ERROR, ErrorMessage, ErrorMessageAction } from './actions';

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
