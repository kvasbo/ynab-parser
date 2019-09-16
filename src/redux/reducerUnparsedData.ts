import { ADD_UNPARSED_DATA, UnparsedDataAction } from './actions';

export type UnparsedData = string;

export interface UnparsedDataState {
    data: string[];
}

const intialState = { data: [] };

export default function unparsedDataStore(
    state: UnparsedDataState = intialState,
    action: UnparsedDataAction,
): UnparsedDataState {
    switch (action.type) {
        case ADD_UNPARSED_DATA: {
            return { data: [action.data, ...state.data] };
        }
        default:
            return state;
    }
}
