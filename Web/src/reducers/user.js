//constants
import c from './../constants';

const user = (state = { addresses: {}, cart: {}, orders: {}, auth: null, review: {}, reviews: null }, action) => {
  let newState = { ...state };
  switch (action.type) {
    case c.USER:
      newState.addresses = action.results.addresses;
      newState.cart = action.results.cart;
      newState.orders = action.results.orders;
      break;
    case c.USER_ADDRESSES:
      newState.addresses = action.results;
      break;
    case c.USER_ADD_ADDRESS:
      if (!newState.addresses[action.addressId]) newState.addresses[action.addressId] = { address: {}, latlng: {} }
      newState.addresses[action.addressId].address = action.address;
      newState.addresses[action.addressId].latlng = action.latlng;
      break;
    case c.USER_REMOVE_ADDRESS:
      if (newState.addresses[action.addressId]) delete newState.addresses[action.addressId];
      break;
    case c.USER_CART:
      newState.cart = action.results;
      break;
    case c.USER_ORDERS:
      newState.orders = action.results;
      break;
    case c.USER_ADD_ORDERS:
      newState.orders = { ...newState.orders, ...action.results };
      break;
    case c.USER_UPDATE_ORDER:
      if (newState.orders[action.orderId]) newState.orders[action.orderId] = { ...newState.orders[action.orderId], ...action.results };
      break;
    case c.USER_CART_PENDING_ORDER:
      newState.cart.pendingOrder = action.results;
      break;
    case c.USER_CART_RESET:
      newState.cart = {};
      break;
    case c.USER_AUTH:
      newState.auth = action.results;
      break;
    case c.USER_CART_QTY:
      newState.cart.currentQty = action.results;
      console.log()
      break;
    case c.USER_CART_ADD_PRODUCT_QTY:
      if (!newState || !newState.cart || !newState.cart['current-cart']) newState.cart['current-cart'] = {};
      if (!newState.cart['current-cart'].business) newState.cart['current-cart'].business = {};
      if (!newState.cart['current-cart'].business.products) newState.cart['current-cart'].business.products = {};
      newState.cart['current-cart'].business.products[action.productId] = { qty: action.qty };
      break;
    case c.USER_CART_REMOVE_PRODUCT:
      if (newState.cart && newState.cart['current-cart'] && newState.cart['current-cart'].business && newState.cart['current-cart'].business?.products[action.productId]) delete newState.cart['current-cart'].business.products[action.productId];
      break;
    case c.USER_REVIEW_ADD_PHOTOS:
      if (!newState.review) newState.review = {};
      if (!newState.review.photos) newState.review.photos = {};
      newState.review.photos = { ...newState.review.photos, ...action.photos };
      break;
    case c.USER_REVIEW_REMOVE_PHOTO:
      if (newState.review && newState.review.photos && newState.review.photos[action.photoId]) delete newState.review.photos[action.photoId];
      break;
    case c.USER_REVIEWS:
      newState.reviews = action.results;
      break;
    case c.USER_REVIEW_ADD:
      if (!newState.reviews) newState.reviews = {};
      newState.reviews[action.reviewId] = action.results;
      break;
    case c.USER_REVIEW_DELETE:
      if (newState.reviews && newState.reviews[action.reviewId]) delete newState.reviews[action.reviewId];
      break;
  }
  return newState;
}

export default user;
