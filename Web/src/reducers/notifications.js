//constants
import c from './../constants';

const notifications = (state = { success: {}, warnings: {}, errors: {} }, action) => {
    let newState = { ...state };
    switch (action.type) {
        case c.ADD_SUCCESS:
            newState.success[action.successId] = action.results;
            break;
        case c.REMOVE_SUCCESS:
            if (newState.success[action.successId]) delete newState[action.successId];
            break;
        case c.ADD_WARNING:
            newState.warnings[action.warningId] = action.results;
            break;
        case c.REMOVE_WARNING:
            if (newState.warnings[action.warningId]) delete newState[action.warningId];
            break;
        case c.ADD_ERROR:
            newState.errors[action.errorId] = action.results;
            break;
        case c.REMOVE_ERROR:
            if (newState.errors[action.errorId]) delete newState[action.errorId];
            break;
    }
    return newState;
}

export default notifications;