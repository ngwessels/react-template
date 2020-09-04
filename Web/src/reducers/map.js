//constants
import c from '../constants';

const map = (state = {
  defaultCenter: {
    lat: 37.8283,
    lng: -98.5795
  },
  center: null,
  defaultZoom: 5.10,
  zoom: null,
  mapRef: null, 
  businesses: {},
}, action) => {
  let newState = {...state};
  switch(action.type) {
    case c.MAP:
      newState = action.results;
      break;
    case c.MAP_CENTER:
      newState.center = action.results;
      break;
    case c.MAP_ZOOM:
      newState.zoom = action.results;
      break;
    case c.MAP_REF:
      newState.mapRef = action.results;
      break;
    case c.MAP_BUSINESSES:
      newState.businesses = action.results;
      break;
  }
  return newState;
}

export default map;