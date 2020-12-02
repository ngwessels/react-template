//constants
import c from '../constants';

const admin = (state = {businesses: {}, products: {}}, action) => {
let newState;
  switch(action.type) {
    case c.ADMIN_APPROVE:
        newState = {...state};
        break;
    case c.ADMIN_APPROVE_BUSINESSES:
        newState = {...state, businesses: action.results};
        break;
    case c.ADMIN_APPROVE_PRODUCTS:
        newState = {...state, products: action.results};
        break;
    case c.ADMIN_APPROVE_PRODUCT_REMOVE:
        newState = {...state};
        delete newState.products[action.productId];
        break;
    case c.ADMIN_APPROVE_BUSINESS_REMOVE:
        newState = {...state};
        delete newState.businesses[action.businessId];
        break;
    default:
        newState = {...state};
        break;
  }
  return newState;
}

export default admin;