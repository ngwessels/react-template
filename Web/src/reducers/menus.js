//constants
import c from './../constants';

const initialState = (state = {}, action) => {
    let newState = {...state};
    switch(action.type) {
        case c.MENU_DISPLAY:
            newState.menu = action.menu;
            newState.display = true;
            if(action && action.data) newState.data = action.data;
            break;
        case c.MENU_REMOVE:
            newState = {};
            break;
    }
    return newState;
}

export default initialState;