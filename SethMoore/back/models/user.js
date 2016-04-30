'use strict';

let bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  config = require(`${__dirname}/../config`);

module.exports = function(mongoose, models) {
  let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    admin: Boolean,
    name: String,
    manager: Boolean,
    team: String
  });

  userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
  });

  userSchema.methods.compareHash = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  userSchema.methods.generateToken = function() {
    return jwt.sign({_id: this._id, name: this.name, admin: this.admin, manager: this.manager, team: this.team}, config.secret);
  }

  let User = mongoose.model('User', userSchema);
  models.User = User;
}
