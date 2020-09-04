self.window = null

require('es6-promise').polyfill();

import firebase from 'firebase/app';
import 'firebase/auth';

//Website Status
const { applicationStatus } = require('../../server/applicationStatus');

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
    apiKey: process.env.REACT_APP_apiKey_test,
    authDomain: process.env.REACT_APP_authDomain_test,
    databaseURL: process.env.REACT_APP_databaseURL_test,
    projectId: process.env.REACT_APP_projectId_test,
    appId: process.env.REACT_APP_appId_test,
    measurementId: process.env.REACT_APP_measurementId_test,
};

let firebaseConfig = firebaseConfigLive;
if (applicationStatus !== 'Live') firebaseConfig = firebaseConfigTest;
firebase.initializeApp(firebaseConfig);


const _ = require('lodash');

const obj = { foo: 'foo' };

_.has(obj, 'foo');


// Respond to message from parent thread
self.addEventListener('message', (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            firebase.auth().signInAnonymously();
        } else {
            console.log('is called')
            setTimeout(() => {
                postMessage({ user: JSON.stringify(user) });
            }, 250)

        }

    })
});