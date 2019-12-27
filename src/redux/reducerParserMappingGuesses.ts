import { CHANGE_PARSER_MAPPING_GUESS, ParserMappingGuessAction } from './actions';
import { ParserMapping, defaultValues } from './reducerParserMapping';

export default function parsedData(
    state: ParserMapping = defaultValues,
    action: ParserMappingGuessAction,
): ParserMapping {
    switch (action.type) {
        case CHANGE_PARSER_MAPPING_GUESS: {
            return { ...state, [action.key]: action.value };
        }
        default:
            return state;
    }
}
