'use strict'
let jwt = require('jsonwebtoken');
let User = require(__dirname + '/../models/users_model');

module.exports = (req, res, next) => {
  var decoded;
  try {
    var token = req.headers.authorization.split(' ')[1];
    decoded = jwt.verify(token, 'KEY STRING');
  }
  catch (e) {
    return res.status(400).json({message: 'authentication error'})
  }
  User.findOne({_id: decoded._id})
    .then(user => {
      next();
    })
    .catch(err => {
      res.status(400).json({message: err})
    })
}
