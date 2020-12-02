//constants
import c from './../constants';


const projects = (state = [], action) => {
    switch (action.type) {
        case c.PROJECTS:
            state = action.results;
            return state;
        default:
            return state;
    }
}

export default projects;