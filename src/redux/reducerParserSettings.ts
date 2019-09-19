import { CHANGE_PARSER_SETTING, ParsedDataAction, ParserSettingAction } from './actions';

export interface ParserSettingsState {
    skipLines: number;
    useHeader: boolean;
    singleSumColumn: boolean;
    dateFormat: string;
}

const initSettings: ParserSettingsState = {
    skipLines: 1,
    useHeader: true,
    singleSumColumn: false,
    dateFormat: 'YYYY-MM-DD',
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
