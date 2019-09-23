import { CHANGE_PARSER_SETTING, ParsedDataAction, ParserSettingAction } from './actions';

export interface ParserSettingsState {
    skipLines: number;
    useHeader: boolean;
    singleSumColumn: boolean;
    dateFormat: string;
    cutOffDate: string;
}

const initSettings: ParserSettingsState = {
    skipLines: 1,
    useHeader: true,
    singleSumColumn: false,
    dateFormat: 'YYYY-MM-DD',
    cutOffDate: '1970-01-01',
};

export default function parsedData(
    state: ParserSettingsState = initSettings,
    action: ParsedDataAction | ParserSettingAction,
): ParserSettingsState {
    switch (action.type) {
        case CHANGE_PARSER_SETTING: {
            return { ...state, [action.key]: action.value };
        }
        default:
            return state;
    }
}
