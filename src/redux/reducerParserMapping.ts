import { CHANGE_PARSER_MAPPING, ParserMappingAction } from './actions';

export interface ParserMapping {
    date: number;
    payee: number;
    inflow: number;
    outflow: number;
    memo: number;
    sum: number;
}

const initMapping: ParserMapping = {
    date: -1,
    payee: -1,
    inflow: -1,
    outflow: -1,
    memo: -1,
    sum: -1,
};

export type parserMappingType = 'date' | 'payee' | 'inflow' | 'outflow' | 'memo' | 'sum';

export default function parsedData(state: ParserMapping = initMapping, action: ParserMappingAction): ParserMapping {
    switch (action.type) {
        case CHANGE_PARSER_MAPPING: {
            return { ...state, [action.key]: action.value };
        }
        default:
            return state;
    }
}
