import { combineReducers } from 'redux';
import errorMessages from './reducerErrorMessage';
import unparsedDataStore from './reducerUnparsedData';

const reducers = combineReducers({
    errorMessages,
    unparsedDataStore,
});

export default reducers;
