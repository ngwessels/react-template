//Axios
import axios from 'axios';


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