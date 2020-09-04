//constants
import c from './../constants';

const errors = (state = {}, action) => {
    let newState = { ...state };
    switch (action.type) {
        case c.ADD_ERROR:
            newState[action.errorId] = action.results;
            break;
        case c.REMOVE_ERROR:
            if (newState[action.errorId]) delete newState[action.errorId];
            break;
    }
    return newState;
}

export default errors;