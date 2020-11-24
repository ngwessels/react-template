//Redux
import { combineReducers } from 'redux';

//Components
import counter from './counter';

const rootReducer = combineReducers({
    counter,
});

export default rootReducer;