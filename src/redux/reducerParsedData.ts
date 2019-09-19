import { ADD_PARSED_DATA, ParsedDataAction } from './actions';
import { ParsedData } from '../parsers/parser';

export interface ParsedDataState {
    data?: ParsedData;
    settings: ParserSettings;
    mapping: ParserMapping;
}

export interface ParserSettings {
    skipLines: number;
    useHeader: boolean;
    singleSumColumn: boolean;
}

export type parserSetting = 'skipLines' | 'useHeader' | 'singleSumColumn';

const initSettings: ParserSettings = {
    skipLines: 1,
    useHeader: true,
    singleSumColumn: false,
};
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

const initialState = { data: undefined, mapping: initMapping, settings: initSettings };

export default function parsedData(state: ParsedDataState = initialState, action: ParsedDataAction): ParsedDataState {
    switch (action.type) {
        case ADD_PARSED_DATA: {
            return { ...state, data: action.data };
        }
        default:
            return state;
    }
}
