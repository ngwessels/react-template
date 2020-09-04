//constants
import c from './../constants';

const navBar = (state = [{ name: 'Home', url: '/' }, { type: 'donation' }, { type: 'cart' }], action) => {
    let newState = state;
    switch (action.type) {
        case c.NAV_BAR_USER:
            newState = [];
            break;
        case c.NAV_BAR_ADMIN:
            newState = [];
            break;
        case c.NAV_BAR_COUNTDOWN:
            newState = [];
            break;
    }
    return newState;
}

export default navBar;