//constants
import c from '../../constants';

const initialState = (state = 0, action) => {
    switch (action.type) {
        case c.INITIAL_STATE:
            state = action.results
            return state;
        default:
            return state;
    }
}

export default initialState;