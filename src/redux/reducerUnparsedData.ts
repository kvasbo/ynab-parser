import { ADD_UNPARSED_DATA, UnparsedDataAction } from './actions';

export type UnparsedData = string;

export interface UnparsedDataState {
    data?: string;
}

const initialState = { data: undefined };

export default function unparsedDataStore(
    state: UnparsedDataState = initialState,
    action: UnparsedDataAction,
): UnparsedDataState {
    switch (action.type) {
        case ADD_UNPARSED_DATA: {
            return { data: action.data };
        }
        default:
            return state;
    }
}
