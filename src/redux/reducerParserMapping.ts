import { CHANGE_PARSER_MAPPING, ParserMappingAction } from './actions';

export interface ParserMapping {
    date: number | null;
    payee: number | null;
    inflow: number | null;
    outflow: number | null;
    memo: number | null;
    sum: number | null;
}

export const defaultValues: ParserMapping = {
    date: null,
    payee: null,
    inflow: null,
    outflow: null,
    memo: null,
    sum: null,
};

export type parserMappingType = 'date' | 'payee' | 'inflow' | 'outflow' | 'memo' | 'sum';

export default function parsedData(state: ParserMapping = defaultValues, action: ParserMappingAction): ParserMapping {
    switch (action.type) {
        case CHANGE_PARSER_MAPPING: {
            return { ...state, [action.key]: action.value };
        }
        default:
            return state;
    }
}
