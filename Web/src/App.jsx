//react
import React, { Suspense } from 'react';

//react-router
import { Switch, Route, withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//firebase
// import firebase from '../config';

//constants or functions
import c from './constants';
import f from './functions';

//Router Guard
import { GuardProvider, GuardedRoute } from 'react-router-guards';

//React-Helmet
import { Helmet } from 'react-helmet';

//BootStrap Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { css, keyframes } from 'emotion';

//Components
import NavBar from './components/NavBar/NavBar'

//components


class App extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            screenHeight: 0,

        }
    }

    componentDidMount() {
        if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
        {
            f.addWarning(this.props, 'We do not recommend using Internet Explorer. Microsoft no longer supports Internet Explorer, and due to that fact many new technologies are no longer compatible. If you experience issues go to a more modern web browser like Chrome, Safari, Edge, or Opera')
        }
    }

    render() { //TODO: Work on meta data
        return (
            <div>
                <NavBar />
            </div>
        );
    }

    renderCartCSS = () => {
        return css({
        })
    }
}

function mapStateToProps(state) {
    return {
    }
}


export default withRouter(connect(mapStateToProps)(App));