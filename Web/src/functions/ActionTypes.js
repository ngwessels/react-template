//firebase
import firebase from './../config';

//uuid
import { v4 as uuid } from 'uuid';

//Axios
import axios from 'axios';

//Constants
const c = require('./../constants');

//Workers
import MyWorker from 'worker-loader!../Workers/DefaultWorker.js';

const { applicationStatus } = require('../../../server/applicationStatus');

//Client Clode

//Update Props
export const reduxDispatch = (props, action) => {
  const { dispatch } = props;
  if (Array.isArray(action)) {
    for (let x in action) {
      dispatch(action[x]);
    }
  } else {
    dispatch(action)
  }
}


//Will close all menus before opening new menu
export const closeAllMenus = (props) => {
}

export const userLoggedIn = () => {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;
    if (user && user.uid) resolve(user);
    else {
      firebase.auth().onAuthStateChanged(user => {
        if (user && user.uid) resolve(user)
        else resolve(false)
      })
      setTimeout(timer => {
        resolve(false);
      }, 3000);
    }
  })
}





export const cipherText = (text) => {
  const CryptoJS = require("crypto-js");
  const ciphertext = CryptoJS.AES.encrypt(text, process.env.REACT_APP_ENCRYPTION_KEY).toString();
  return ciphertext;
}

export const cipherObject = (object) => {
  const CryptoJS = require("crypto-js");
  const cipherObject = CryptoJS.AES.encrypt(JSON.stringify(object), process.env.REACT_APP_ENCRYPTION_KEY).toString();
  return cipherObject
}

export const decryptObject = (object) => {
  const CryptoJS = require("crypto-js");
  const bytes = CryptoJS.AES.decrypt(object, process.env.REACT_APP_ENCRYPTION_KEY);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return data;
}

export const apiReduxDispatch = (props, res, callback) => {
  if (res.headers['content-type'] === 'text/html; charset=utf-8') {
    const data = decryptObject(res.data);
    if (applicationStatus !== 'Live') console.log('Data:', data)
    if (data.dispatch) {
      for (let x in data.dispatch) {
        reduxDispatch(props, data.dispatch[x]);
      }
    }
    if (data.link && data.link.url) {
      window.open(data.link.url, '_blank')
    }
    if (data.history) {
      props.history.push(data.history);
    }
    if (data.success) {
      addSuccess(props, data.success)
    }
    if (callback) {
      if (data.results || data.results === false) callback(data.results)
      else callback();
    }
  }
}

export const addError = (props, data) => {
  const errorId = uuid();
  const action = {
    type: 'ADD_ERROR',
    errorId,
    results: data
  }
  reduxDispatch(props, action);
}

export const addSuccess = (props, data) => {
  const successId = uuid();
  const action = {
    type: 'ADD_SUCCESS',
    successId,
    results: data
  }
  reduxDispatch(props, action);
}

export const addWarning = (props, data) => {
  const warningId = uuid();
  const action = {
    type: 'ADD_WARNING',
    warningId,
    results: data
  }
  reduxDispatch(props, action);
}

export const apiError = (err, callback, props) => {
  if (applicationStatus !== 'Live') {
    if (err && err.response) console.log(err.response)
    else console.log(err);
  }

  const data = decryptObject(err.response.data);
  addError(props, data);
  if (data.history) props.history.push(data.history);
  if (data.dispatch) reduxDispatch(props, data.dispatch)
  if (callback) callback(false, data.message, data.results)
}

export const Api = async (props, method, url, encrypted, body, callback) => {
  let worker = new MyWorker();
  worker.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    if (data.isPass) {
      apiReduxDispatch(props, data, callback)
    } else {
      let object = data.err;
      apiError(object, callback, props)
    }
    worker.terminate();
  });
  let token = 'User Not Defined'
  if (firebase.auth().currentUser) token = await firebase.auth().currentUser.getIdToken();
  let data = {};
  if (body) data = body;
  url = `${props.url}${url}`;
  if (encrypted === true) {
    const dataObject = {
      method: method,
      url: url,
      headers: { Authorization: cipherText(`Bearer ${token}`), apiKey: cipherText(process.env.REACT_APP_FIREBASE_FUNCTIONS) },
      data: { results: cipherObject(data), encrypted }
    }
    if (applicationStatus !== 'Live') console.log(dataObject)
    worker.postMessage(JSON.stringify(dataObject));
  } else {
    const dataObject = {
      method: method,
      url: url,
      headers: { Authorization: cipherText(`Bearer ${token}`), apiKey: cipherText(process.env.REACT_APP_FIREBASE_FUNCTIONS) },
      data: data
    }
    if (applicationStatus !== 'Live') console.log(dataObject)
    axios(dataObject).then(res => {
      apiReduxDispatch(props, res, callback)
    }).catch(err => {
      apiError(err, callback, props)
    })
  }
}
