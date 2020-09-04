//constants
import c from '../constants';

//Website Status
const { applicationStatus } = require('../../../server/applicationStatus');


let apiUrl;

if (applicationStatus === 'Live') {
    apiUrl = (state = 'https://us-west3-verboort-dinner.cloudfunctions.net/app/', action) => {
        let newState = state;
        switch (action.type) {
            case c.URL:
                newState = action.results;
                break;
            default:
                break;
        }
        return newState;
    }
}
else if (applicationStatus === 'TestLive') {
    apiUrl = (state = 'https://us-west3-verboort-dinner-test.cloudfunctions.net/app/', action) => {
        let newState = state;
        switch (action.type) {
            case c.URL:
                newState = action.results;
                break;
            default:
                break;
        }
        return newState;
    }
}
else if (applicationStatus === 'Test') {
    apiUrl = (state = 'http://0.0.0.0:5000/verboort-dinner-test/us-west3/app/', action) => {
        let newState = state;
        switch (action.type) {
            case c.URL:
                newState = action.results;
                break;
            default:
                break;
        }
        return newState;
    }
}

export default apiUrl;