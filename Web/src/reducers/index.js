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
import mediaQueries from './mediaQueries';
import navBar from './navBar';
import auth from './auth'
import notifications from './notifications';
import projects from './projects';


const rootReducer = combineReducers({
  map: map,
  user: user,
  admin: admin,
  menus: menus,
  mediaQueries,
  navBar,
  auth,
  notifications,
  projects
})

export default rootReducer;
