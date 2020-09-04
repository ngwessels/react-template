//firebse functions
const functions = require('firebase-functions');

//firebase admin
const admin = require('firebase-admin');

//Environment
require('dotenv').config();

//Function Variables
const { keys, reports } = require('./functions/index');

//path
const path = require('path');


//firebase initializeApp
if (keys.test) {
    //testing
    admin.initializeApp({
        // credential: admin.credential.cert(serviceAccountTest),
        apiKey: ,
        authDomain: ,
        databaseURL: ,
        projectId: ,
        storageBucket:,
        messagingSenderId:,
        appId:,
        measurementId: 
    });
} else {
    //Live
    admin.initializeApp({
        // credential: admin.credential.cert(serviceAccount),
        apiKey: ,
        authDomain: ,
        databaseURL: ,
        projectId: ,
        storageBucket: ,
        messagingSenderId:,
        appId:,
        measurementId: 
    });
}


//RunTimeOptions
const RunTimeOptions = {
    timeoutSeconds: 30,
    memory: '2GB'
}













