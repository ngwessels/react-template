import { Provider } from 'react-redux';
import React from 'react';
import withRedux from "next-redux-wrapper";
import store from '../redux/store';
import App from 'next/app';

//Components
import NavBarGitHub from './../components/NavBars/Github';

//Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './../components/NavBars/Github/Mobile/styling.css'


class MyApp extends App {
  constructor() {
    super();
    this.state = {

    }
  }

  render() {
    //Information that was returned  from 'getInitialProps' are stored in the props i.e. pageProps
    const { Component, pageProps } = this.props;
    return (
      <div>
        <NavBarGitHub />
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </div>

    );
  }
}
const makeStore = () => store;

//withRedux wrapper that passes the store to the App Component
export default withRedux(makeStore)(MyApp);
