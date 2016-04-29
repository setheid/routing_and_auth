'use strict'
const User = require(__dirname + '/../models/users_model');

module.exports = (apiRouter) => {
  apiRouter.route('/signup')
    .post((req, res) => {
      var newUser = new User();
        // if (!((req.body.email || '').length && (req.body.password || '').length > 7)) {
        //   return res.status(400).json({msg: 'invalid username or password'});
        // }
      newUser.username = req.body.username || req.body.email;
      newUser.authentication.email = req.body.email;
      newUser.hashPassword(req.body.password);
      console.log('INSIDE AUTH ROUTE, NEWUSER: ', newUser);
      newUser.save((err, data) => {
        console.log('this is save error: ', err);
        if (err) return console.log(err);
        res.status(200).json({token: data.generateToken()});
      });
  });

  apiRouter.route('/signin')
    .get((req, res) => {
      User.findOne({'authentication.email': req.basicHTTP.email}, (err, user) => {
        if (err) {
          console.log(err);
          return res.status(401).json({msg: 'Signin error'});
        }

        if (!user) return res.status(401).json({msg: 'You are not a user'});

        if (!user.comparePassword(req.basicHTTP.password)) return res.status(401).json({msg: 'You credentials did not match.'});

        res.json({token: user.generateToken()});
      });
    });
}
