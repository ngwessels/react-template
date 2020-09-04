//constants
import c from './../constants';

const auth = (state = null, action) => {
    let newState = state;
    switch (action.type) {
        case c.AUTH:
            newState = action.results;
            break;
    }
    return newState;
}

export default auth;