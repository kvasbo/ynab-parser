import { ADD_PARSED_DATA, ParsedDataAction } from './actions';
import { ParsedData } from '../parsers/parser';

export interface ParsedDataState {
    data?: ParsedData;
}

const initialState = { data: undefined };

export default function parsedData(state: ParsedDataState = initialState, action: ParsedDataAction): ParsedDataState {
    switch (action.type) {
        case ADD_PARSED_DATA: {
            return { ...state, data: action.data };
        }
        default:
            return state;
    }
}
