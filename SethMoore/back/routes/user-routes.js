'use strict';

let base64Decoder = require('../lib/base64Decoder');
let jwt = require('jsonwebtoken');
let config = require('./../config');

module.exports = function(router, models) {
  let User = models.User;

  router.get('/signup', (req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
      if (err) return console.log(err);

      if (user) {
        res.json({
          status: 'failure',
          message: 'username already exists'
        });
        return res.end();

      } else if (!req.body.username || !req.body.password) {

        return res.json({
          status: 'failure',
          message: 'a required field is empty'
        });

      } else {

        var newUser = new User(req.body);
        newUser.save((err, user) => {
          if (err) return console.log(err);
          res.json({data: user});
        });
      }
    });
  });

  router.get('/login', (req, res) => {
    let userLogin = base64Decoder(req.headers);
    let userName = userLogin[0];
    let password = userLogin[1];
    User.findOne({username: userName}, (err, user) => {
      if (err) return res.send(err);

      let valid = user.compareHash(password);
      if (!valid) return res.status(400).json({message:'authentication error'});

      let token = user.generateToken();
      let decodedUser = jwt.verify(token, config.secret);
      res.json({user: decodedUser, token: token});
    });
  });

  router.get('/validate', (req, res) => {
    let decodedUser = jwt.verify(req.headers.token, config.secret);
    res.json({ user: decodedUser });
  });
}
