import React from "react";

//Redux
import { connect } from 'react-redux';
import { withRouter, Link, Redirect } from 'react-router-dom';

//Styling
import { Button, Form, } from 'react-bootstrap';
import { css, keyframes } from 'emotion';

//Functions
import f from './../../functions';
//Constants
import c from './../../constants';

//components

class BasicFooter extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {

    }



    render() {
        const date = new Date();
        const year = date.getFullYear();
        return (
            <div className={`${this.renderCSS()}`}>
                <footer>
                    <div className={'left'} >
                        <p>Website Designed by Nate Wessels</p>
                    </div>
                    <div className={'right'}>
                        <p onClick={() => this.props.history.push('/privacy')}>Privacy Policy</p>
                        <p onClick={() => this.props.history.push('/disclaimer')}>Website Disclaimer</p>
                    </div>
                </footer>
            </div>
        );
    }

    renderCSS = () => {
        const mq = this.props.mq;
        return css({
            width: '100%',
            bottom: 0,
            top: '100%',
            'footer': {
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                paddingLeft: '30px',
                color: '#ababab',
                borderTop: '1px solid #e5e5e5',
                backgroundColor: '#202020',
                justifyContent: 'space-between',
                [mq[1]]: {
                    '.left': {
                        width: 300,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        'p': {
                            margin: 0
                        }
                    },
                    '.right': {
                        width: 250,
                        marginRight: 50,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: "center",
                        flexDirection: 'row',
                        'p': {
                            margin: 0,
                            cursor: 'pointer',

                        }
                    }
                },
                [mq[0]]: {
                    '.left': {
                        display: 'none',
                    },
                    '.right': {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: "center",
                        flexDirection: 'row',
                        width: '100%',
                        marginRight: 30,
                        'p': {
                            margin: 0,
                            cursor: 'pointer'
                        }
                    }
                }

            }
        })
    }

}

function mapStateToProps(state) {
    return {
        mq: state.mediaQueries,
    }
}

export default withRouter(connect(mapStateToProps)(BasicFooter));