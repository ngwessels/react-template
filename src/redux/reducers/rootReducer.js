//Redux
import { combineReducers } from 'redux';

//Components
import counter from './counter';
import mq from './mediaQueries';

const rootReducer = combineReducers({
    counter,
    mq,
});

export default rootReducer;