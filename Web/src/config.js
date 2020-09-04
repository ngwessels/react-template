import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';

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
firebase.analytics();

export default firebase;
