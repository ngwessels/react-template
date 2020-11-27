//constants
import c from './../../constants';


const mq = [
    '@media only screen and (max-width: 600px)', /* Extra small devices (phones, 600px and down) */
    '@media only screen and (min-width: 600px)', /* Small devices (portrait tablets and large phones, 600px and up) */
    '@media only screen and (min-width: 768px)', /* Medium devices (landscape tablets, 768px and up) */
    '@media only screen and (min-width: 992px)', /* Large devices (laptops/desktops, 992px and up) */
    '@media only screen and (min-width: 1200px)' /* Extra large devices (large laptops and desktops, 1200px and up) */
];

const mediaQueries = (state = mq, action) => {
    return state;
}

export default mediaQueries;