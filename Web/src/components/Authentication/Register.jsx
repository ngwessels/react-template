//react
import React from 'react';

//Redux
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

//firebase
import firebase from '../../config';

//react css
import { css, keyframes } from 'emotion';

//constants or functions
import c from '../../constants';
import f from '../../functions';

import { MDBCol, MDBRow } from "mdbreact";
import { Form, Col } from 'react-bootstrap';

//Components





//components



class Register extends React.Component {

  constructor({ match }) {
    super();
    this.state = {
      email: null,
      password: null,
      validatePassword: null,
      error: null,
      displayError: 'none',
      fName: '',
      lName: '',
      community: '',

    }
  }


  componentDidMount() {
    firebase.auth().signOut();
    const action = {
      type: 'NAV_BAR_COUNTDOWN'
    };
    const action2 = {
      type: 'AUTH',
      results: 0
    }
    f.reduxDispatch(this.props, [action, action2]);
  }

  //JavaScript

  register = async (event) => {
    event.preventDefault();
    const email = this.email();
    const password = this.password;
    const validatePassword = this.validatePassword();
    if (email && password && validatePassword) {
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((e) => {
        if (e) {
          setTimeout(() => {
            f.Api(this.props, 'post', 'users/newUser', true, { fName: this.state.fName, lName: this.state.lName, email: this.state.email, community: this.state.community });
            this.setState({ error: null, displayError: 'hidden' })
            this.props.history.push('/');
          }, 500)
        }
      }).catch((error) => {
        this.setState({ error: error.message, displayError: 'block' })
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return;
      })
    } else {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }


  email = () => {
    if (this.state.email !== null) return this.state.email;
    else return false;
  }

  password = () => {
    if (this.state.password !== null) return this.state.password;
    else return false;
  }

  validatePassword = () => {
    if (this.state.validatePassword !== null && this.state.validatePassword === this.state.password) return true;
    else {
      this.setState({ error: 'Passwords do not match', displayError: 'block' })
      return false
    };
  }



  render() {
    return (
      <div className={`${this.renderCSS()}`}>
        <form className={'form'} onSubmit={this.register}>
          <h2 className={'form-title'}>Register</h2>
          <div className={'error-block'}>
            <p className={'error'}>{this.state.error}</p>
          </div>
          <MDBRow>
            <MDBCol md="6" className="mb-4">
              <label htmlFor="firstName">First name</label>
              <input type="fName" id="firstName" className="form-control" value={this.state.fName} placeholder={'John'} required={true} onChange={(e) => {
                this.setState({ fName: e.target.value })
              }} />
            </MDBCol>
            <MDBCol md="6" className="mb-2">
              <label htmlFor="lastName">Last name</label>
              <input type="lName" id="lastName" className="form-control" value={this.state.lName} placeholder={'Smith'} required={true} onChange={(e) => {
                this.setState({ lName: e.target.value })
              }} />
            </MDBCol>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Parishoner or Parent</Form.Label>
              <Form.Control as="select" required={true} onChange={(e) => this.setState({ community: e.target.value })}>
                <option>Choose...</option>
                <option value={'Parishoner'}>Parishoner</option>
                <option value={'Parent'}>Parent</option>
              </Form.Control>
            </Form.Group>
          </MDBRow>
          <div className={'input-block'}>
            <label className={'label'}>Email</label>
            <input placeholder={'example@yahoo.com'} type={'email'} name={'email'} className={'input email-input'} onChange={(e) => this.setState({ email: e.target.value })} />
          </div>
          <div className={'input-block'} >
            <label className={'label'}>Password</label>
            <input type={'password'} name={'password'} className={'input pw-input'} onChange={(e) => this.setState({ password: e.target.value })} />
            <p className={'input-info'} >Must be at least 6 characters long</p>
          </div>
          <div className={'input-block'}>
            <label className={'label'} >Repeat password</label>
            <input type={'password'} name={'password'} className={'input rpw-input'} onChange={(e) => this.setState({ validatePassword: e.target.value })} />
          </div>
          <div className={'input-block'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 60 }}>
            <button type={'submit'} value={'Register'} className={'input-submit'} >Register</button>
          </div>
        </form>
      </div>

    )
  }

  //Styles

  //renderCSS
  renderCSS = () => {
    let displayButton = 'none', s = this.state;
    if (s.email && s.fName && s.lName && s.community && s.password && s.validatePassword) displayButton = 'flex';
    const mq = this.props.mq;
    return css({
      [mq[0]]: {
        '.form': {
          width: '90%',
        },
      },
      [mq[1]]: {
        '.form': {
          minWidth: '500px',
          maxWidth: '1000px'
        },
      },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: 100,

      '.form-title': {
        textAlign: 'center',
        marginBottom: '16px',
        fontSize: '2em'
      },
      '.error-block': {
        padding: '12px',
        width: '100%',
        background: '#ffb9c5',
        color: '#721121',
        borderRadius: '3px',
        marginBottom: '16px',
        boxSizing: 'border-box',
        display: this.state.displayError,
        textAlign: 'center'
      },
      '.error': {
        fontSize: '1.1em',
        margin: 0
      },
      '.success': {
        background: '#c1ffb9',
        color: '#16790d'
      },
      '.input-block': {
        textAlign: 'center',
      },
      '.label': {
        display: 'block',
        marginBottom: '8px',
        fontSize: '1.1em',
        textAlign: 'left'
      },
      '.input-info': {
        textAlign: 'left',
        marginTop: '-18px',
        marginBottom: '24px',
        color: '#888'
      },
      '.input': {
        width: '100%',
        borderRadius: '3px',
        fontSize: '1.1em',
        padding: '8px 12px',
        border: '1px solid #ccc',
        color: '#1d1d1d',
        marginBottom: '24px',
        outline: 0,
        boxSizing: 'border-box'
      },
      '.input-submit': {
        padding: '8px 20px',
        border: 0,
        fontSize: '1.1em',
        background: '#258bad',
        color: '#fff',
        borderRadius: '3px',
        outline: 0,
        transition: '0.15s ease-in-out background',
        display: displayButton
      },
      '.input-submit:hover': {
        background: '#24a4cf'
      },
      '.signin-options': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25
      }
    })
  }

}
function mapStateToProps(state) {
  return {
    user: state.user,
    mq: state.mediaQueries,
    url: state.url,
  }
}


export default withRouter(connect(mapStateToProps)(Register));
const styles = {

}
