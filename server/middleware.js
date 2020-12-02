/* eslint-disable callback-return */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();

//Environment
require('dotenv').config();

exports.testApi = () => {

}

exports.validateApiToken = (req, res, next) => {
  if (req.headers.apikey && req.headers.apikey === process.env.FIREBASE_FUNCTIONS) {
    next();
    return;
  } else {
    res.status(403).send('Unauthorized');
    return;
  }
}

exports.validateFirebaseIdToken = async (req, res, next) => {
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) && (req.cookies && req.cookies.__session)) {
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized 2');
    return;
  }
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    res.status(403).send('Unauthorized');
    return;
  }
};

exports.verifyManagers = (req, res, next) => {
  exports.checkManagers(req.user.uid, (e) => {
    if (e) {
      next();
      return;
    } else {
      res.status(403).send('Unauthorized');
      return;
    }
  })
}


exports.checkManagers = (userId, callback) => {
  admin.database().ref(`staff/managers/${userId}`).once('value').then(snap => {
    const val = snap.val();
    if (val) {
      callback(true);
    } else {
      callback(false);
    }
    return val;
  })
    .catch(err => {
      console.error(err);
    })
}

exports.verifyAdmin = (req, res, next) => {
  exports.checkAdmin(req.user.uid, (e) => {
    if (e) {
      next();
      return;
    } else {
      res.status(403).send('Unauthorized');
      return;
    }
  })
}

//Will check to see if user is an admin
exports.checkAdmin = (userId, callback) => {
  admin.database().ref(`staff/admins/${userId}`).once('value').then(snap => {
    const val = snap.val();
    if (val) {
      callback(true);
    } else {
      callback(false);
    }
    return val;
  })
    .catch(err => {
      console.error(err);
    })
}

exports.verifyOwner = (req, res, next) => {
  exports.checkOwner(req.user.uid, (e) => {
    if (e) {
      next();
      return;
    } else {
      res.status(403).send('Unauthorized');
      return;
    }
  })
}

//Is basically super admin. They have all privelages. Including adding admins and deleting admins
exports.checkOwner = (userId, callback) => {
  admin.database().ref(`staff/owner/${userId}`).once('value').then(snap => {
    const val = snap.val();
    if (val) {
      callback(true);
    } else {
      callback(false);
    }
    return val;
  })
    .catch(err => {
      console.error(err);
    })
}




