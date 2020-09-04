//constants
import c from './../constants';

const success = (state = {}, action) => {
    let newState = { ...state };
    switch (action.type) {
        case c.ADD_SUCCESS:
            newState[action.successId] = action.results;
            break;
        case c.REMOVE_SUCCESS:
            if (newState[action.successId]) delete newState[action.successId];
            break;
    }
    return newState;
}

export default success;