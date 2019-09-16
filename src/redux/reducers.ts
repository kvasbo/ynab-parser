import { combineReducers } from 'redux';
import errorMessages from './reducerErrorMessage';

const reducers = combineReducers({
    errorMessages,
});

export default reducers;
