import Moment from 'moment';
import { CHANGE_PARSER_SETTING, ParsedDataAction, ParserSettingAction } from './actions';

export interface ParserSettingsState {
    skipLines: number;
    useHeader: boolean;
    singleSumColumn: boolean;
    dateFormat: string;
    cutOffDate: Date;
}

const initSettings: ParserSettingsState = {
    skipLines: 1,
    useHeader: true,
    singleSumColumn: false,
    dateFormat: 'DD.MM.YYYY',
    cutOffDate: Moment()
        .subtract(1, 'month')
        .toDate(),
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
