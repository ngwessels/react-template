//Redux
import { combineReducers } from 'redux';

//constants
import c from '../constants';

//Components
import map from './map';
import user from './user';
import apiUrl from './apiUrl';
import admin from './admin';
import menus from './menus';
import errors from './errors';
import mediaQueries from './mediaQueries';
import navBar from './navBar';
import success from './success';
import warning from './warning'
import auth from './auth'


const rootReducer = combineReducers({
  map: map,
  user: user,
  admin: admin,
  menus: menus,
  business,
  mediaQueries,
  errors,
  success,
  navBar,
  auth,
  warning,
})

export default rootReducer;
