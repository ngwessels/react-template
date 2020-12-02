import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//react-router
import { Switch, Route, withRouter } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

//Redux
import { connect } from 'react-redux';

//Constants
import f from './../../functions'
import c from './../../constants'
import { css } from 'emotion';



class Error extends React.Component {
    constructor() {
        super();
    }


    componentDidMount() {
        setTimeout(() => {
            this.props.removeError(this.props.errorId);
        }, 15000)

    }

    render() {
        if (!this.props.error.message) this.props.removeError(this.props.errorId);
        return (
            <Alert key={`Alert-${this.props.errorId}`} variant="danger" onClose={() => this.props.removeError(this.props.errorId)} dismissible>
                <Alert.Heading>You got an error!</Alert.Heading>
                <p>{this.props.error.message}</p>
            </Alert>
        )
    }
}

class Warning extends React.Component {
    componentDidMount() {
    }

    render() {
        if (!this.props.message) this.props.removeWarning(this.props.warningId);
        return (
            <Alert key={`Alert-${this.props.warningId}`} variant="warning" onClose={() => this.props.removeWarning(this.props.warningId)} dismissible>
                <Alert.Heading>Warning</Alert.Heading>
                <p>{this.props.message}</p>
            </Alert>
        )
    }
}

class Success extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.removeSuccess(this.props.successId);
        }, 15000)

    }

    render() {
        if (!this.props.message) this.props.removeSuccess(this.props.successId);
        return (
            <Alert key={`Alert-${this.props.errorId}`} variant="success" onClose={() => this.props.removeSuccess(this.props.successId)} dismissible>
                <Alert.Heading>Success</Alert.Heading>
                <p>{this.props.message}</p>
            </Alert>
        )
    }
}

class ApiError extends React.Component {
    constructor() {
        super();
    }

    removeError = (errorId) => {
        const action = {
            type: c.REMOVE_ERROR,
            errorId,
        };
        f.reduxDispatch(this.props, action);
    }

    removeSuccess = (successId) => {
        const action = {
            type: c.REMOVE_SUCCESS,
            successId,
        };
        f.reduxDispatch(this.props, action);
    }

    removeWarning = (warningId) => {
        const action = {
            type: c.REMOVE_WARNING,
            warningId,
        };
        f.reduxDispatch(this.props, action);
    }

    render() {
        return (
            <div className={`${this.renderCSS()}`}>
                {Object.keys(this.props.errors).map(errorId => {
                    const error = this.props.errors[errorId];
                    return (
                        <Error key={`Error-${errorId}`} errorId={errorId} error={error} removeError={this.removeError} />
                    )
                })}
                {Object.keys(this.props.success).map(successId => {
                    const success = this.props.success[successId];
                    return (
                        <Success key={`Success-${successId}`} successId={successId} message={success} removeSuccess={this.removeSuccess} />
                    )
                })}
                {Object.keys(this.props.warning).map(warningId => {
                    const warning = this.props.warning[warningId];
                    return (
                        <Warning key={`Warning-${warningId}`} warningId={warningId} message={warning} removeWarning={this.removeWarning} />
                    )
                })}
            </div>
        );
    }

    renderCSS = () => {
        return css({
            position: 'fixed',
            width: '100%',
            top: 60,
            zIndex: 10000000000000
        })
    }
}

function mapStateToProps(state) {
    return {
        errors: state.errors,
        url: state.url,
        success: state.success,
        warning: state.warning,
    }
}

export default withRouter(connect(mapStateToProps)(ApiError));