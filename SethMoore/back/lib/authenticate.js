'use strict';

let jwt = require('jsonwebtoken');
let config = require('./../config');

module.exports = function(req, res, next) {
  try {
    var token = req.headers.token;
    req.decodedToken = jwt.verify(token, config.secret);
    next();
  }
  catch (e) {
    return res.status(400).json({message: 'authentication error'});
  }
}
