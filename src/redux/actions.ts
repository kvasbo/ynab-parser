import { ErrorMessage } from './reducerErrorMessage';
import { UnparsedData } from './reducerUnparsedData';
import { ParsedData } from '../parsers/parser';
import { parserMappingType } from './reducerParserMapping';

export const ADD_ERROR = 'ADD_ERROR';
export const ADD_UNPARSED_DATA = 'ADD_UNPARSED_DATA';
export const ADD_PARSED_DATA = 'ADD_PARSED_DATA';
export const CHANGE_PARSER_SETTING = 'CHANGE_PARSER_SETTING';
export const CHANGE_PARSER_MAPPING = 'CHANGE_PARSER_MAPPING';
export const CHANGE_PARSER_MAPPING_GUESS = 'CHANGE_PARSER_MAPPING_GUESS';

export interface ErrorMessageAction {
    type: typeof ADD_ERROR;
    error: ErrorMessage;
}

export interface UnparsedDataAction {
    type: typeof ADD_UNPARSED_DATA;
    data: UnparsedData;
}

export interface ParsedDataAction {
    type: typeof ADD_PARSED_DATA;
    data: ParsedData;
}

type ParserSettingType = boolean | string | number | Date;

export interface ParserSettingAction {
    type: typeof CHANGE_PARSER_SETTING;
    key: string;
    value: ParserSettingType;
}

export interface ParserMappingAction {
    type: typeof CHANGE_PARSER_MAPPING;
    key: parserMappingType;
    value: number;
}

export interface ParserMappingGuessAction {
    type: typeof CHANGE_PARSER_MAPPING_GUESS;
    key: parserMappingType;
    value: number;
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

export function addParsedData(data: ParsedData): ParsedDataAction {
    return {
        type: ADD_PARSED_DATA,
        data,
    };
}

export function changeParserSetting(key: string, value: ParserSettingType): ParserSettingAction {
    return {
        type: CHANGE_PARSER_SETTING,
        key,
        value,
    };
}

export function changeParserMapping(key: parserMappingType, value: number): ParserMappingAction {
    return {
        type: CHANGE_PARSER_MAPPING,
        key,
        value,
    };
}

export function changeParserMappingGuess(key: parserMappingType, value: number): ParserMappingGuessAction {
    return {
        type: CHANGE_PARSER_MAPPING_GUESS,
        key,
        value,
    };
}
