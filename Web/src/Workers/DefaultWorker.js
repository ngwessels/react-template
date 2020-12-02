
//Axios
import axios from 'axios';
import { post } from 'jquery';

require('es6-promise').polyfill();


const _ = require('lodash');

const obj = { foo: 'foo' };

_.has(obj, 'foo');


// Respond to message from parent thread
self.addEventListener('message', (event) => {
    const object = JSON.parse(event.data);
    axios(object).then(res => {
        let data = res
        data.isPass = true;
        data = JSON.stringify(data);
        postMessage(data);
    }).catch(err => {
        let data = { isPass: false, err: { response: err.response } };
        data = JSON.stringify(data);
        postMessage(data)
    })
});
