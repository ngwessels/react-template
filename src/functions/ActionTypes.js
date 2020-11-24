//firebase
import firebase from '../firebase';

import React, { useEffect } from "react";

//uuid
import { v4 as uuid } from 'uuid';

//Axios
import axios from 'axios';

//Constants
const c = require('../constants');

//Workers
import MyWorker from '../example.worker';



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

export const authorization = async (props, callback) => {
    if (firebase?.auth()?.currentUser?.uid) {
        Api(props, 'get', 'users/auth/get', true, {}, (e) => {
            console.log('Results 1:', e)
            e.authority.account = firebase.auth().currentUser;
            callback(e.authority);
        });

    } else {
        firebase.auth().onAuthStateChanged(async (user) => {
            Api(props, 'get', 'users/auth/get', true, {}, (e) => {
                console.log('Results 2:', e)
                e.authority.account = user;
                callback(e.authority)
            });

        })
    }

}


//Will close all menus before opening new menu
export const closeAllMenus = (props) => {
    let action = {
        type: "PURCHASE",
        results: false
    };
    reduxDispatch(props, action);
    action = {
        type: "SELECT_ITEMS",
        results: { display: false, productId: null }
    };
    reduxDispatch(props, action);
    action = {
        type: "PROCESSING_ORDER",
        results: false,
    };
    reduxDispatch(props, action);
    action = {
        type: "CHECKOUT",
        results: false,
    };
    reduxDispatch(props, action);
    action = {
        type: "BUSINESS_PRODUCTS",
        results: null,
    };
    reduxDispatch(props, action);
}

export const userLoggedIn = () => {
    return new Promise((resolve, reject) => {
        const user = firebase.auth().currentUser;
        if (user && user.uid) resolve(true);
        else {
            firebase.auth().onAuthStateChanged(user => {
                if (user && user.uid) resolve(true)
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
    const data = decryptObject(res.data);
    console.log(data);
    if (props && props.url && data.dispatch) {
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
    if (data.warning) {
        addWarning(props, data.warning)
    }
    if (callback) {
        if (data.results || data.results === false) callback(data.results)
        else callback();
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
    if (err && err.response) {
        const data = decryptObject(err.response.data);
        console.log(data)
        addError(props, data);
        if (callback) callback(false, data.message, data.results)
    }
    else console.log(err);
}

export const Api = async (props, method, url, body, callback) => {
    let worker = new MyWorker();
    worker.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        if (data.isPass) {
            apiReduxDispatch(props, data, callback)
        } else {
            let object = data.err;
            // object.data = JSON.parse(object.data);
            apiError(object, callback, props)
        }
        worker.terminate();
    });
    let token = 'User Not Defined'
    if (firebase.auth().currentUser) token = await firebase.auth().currentUser.getIdToken();
    let data = {};
    if (body) data = body;
    url = `${props.url}${url}`;
    const dataObject = {
        method: method,
        url: url,
        headers: { Authorization: cipherText(`Bearer ${token}`), apiKey: cipherText(process.env.REACT_APP_FIREBASE_FUNCTIONS) },
        data: { results: cipherObject(data) }
    }
    worker.postMessage(JSON.stringify(dataObject));
}

export const preApi = async (domain, method, url, body) => {
    return new Promise((resolve, reject) => {
        let data = {};
        if (body) data = body;
        let token = 'User Not Defined'
        url = `http://0.0.0.0:5000/localhoney-test/us-central1/app/${url}`;
        const dataObject = {
            method: method,
            url: url,
            headers: { Authorization: cipherText(`Bearer ${token}`), apiKey: cipherText(process.env.REACT_APP_FIREBASE_FUNCTIONS) },
            data: { results: cipherObject(data) }
        }
        axios(dataObject).then(res => {
            const data = decryptObject(res.data);
            if (data && data.results) resolve(data);
            else resolve(false);
        }).catch(err => {
            resolve(false)
            console.log(err)
        })
    })
}