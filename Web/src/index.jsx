import "core-js/stable";
import "regenerator-runtime/runtime";

//react
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

//react router
import { HashRouter } from 'react-router-dom';

//redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';


//root reducer
import rootReducer from './reducers/index';

//components
import App from './App';

//Firebase
// import firebase from './config';

//redux store
const store = createStore(rootReducer);




const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <HashRouter>
        <Provider store={store} >
          <Component />
        </Provider>
      </HashRouter>
    </AppContainer>,
    document.getElementById('react-app-root')
  );
};

render(App);

/*eslint-disable */
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
/*eslint-enable */
