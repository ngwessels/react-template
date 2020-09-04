//constants
import c from './../constants';

const warning = (state = {}, action) => {
    let newState = { ...state };
    switch (action.type) {
        case c.ADD_WARNING:
            newState[action.warningId] = action.results;
            break;
        case c.REMOVE_WARNING:
            if (newState[action.warningId]) delete newState[action.warningId];
            break;
    }
    return newState;
}

export default warning;