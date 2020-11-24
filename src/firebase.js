import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';

//Website Status
// const { applicationStatus } = require('../../server/applicationStatus');

//For Live
const firebaseConfigLive = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
};

// For Testing
const firebaseConfigTest = {
    apiKey: 'AIzaSyDVC3Z6J1xDyzUYFgyvkDKx793L7cX17VA',
    authDomain: 'localhoney-test.firebaseapp.com',
    databaseURL: 'https://localhoney-test.firebaseio.com',
    projectId: 'localhoney-test',
    appId: '1:600116129168:web:b861d21dbb0e36b37ed715',
    measurementId: 'G-9NSX0Z6KS4',
};

let firebaseConfig = firebaseConfigLive;
// if (applicationStatus !== 'Live') firebaseConfig = firebaseConfigTest;

if (typeof window !== undefined && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);

} else if (typeof window !== undefined && firebase.apps.length) {
    // firebase.analytics();
}

export default firebase;