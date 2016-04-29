'use strict'
let User = require(__dirname + '/../models/users_model');

module.exports = (apiRouter) => {
  apiRouter.route('/createUser')
    .get((req, res) => {
      User.findOne({_id: req.user._id}, (err, data) => {
        if(err) return console.log(err);
        res.json({username: data.username})
      });
    });
}
