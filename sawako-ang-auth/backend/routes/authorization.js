'use strict';
var User = require('./../models/user');
let jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
  var decoded;
  console.log('UNDIFINED?? : ' + req.headers.token);
  try{
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'FLUFFBALL');
    // console.log(decoded);
  } catch (err){
    return res.status(401).json({msg: 'authentication did not go thru1'});
  }
  User.findOne({_id: decoded._id}, (err, user)=>{
    // console.log('Here is user in auth : ' + user);
    if(err){
      // console.log('Could not find user : ' + err);
      return res.status(401).json({msg: 'authentication did not go thru2'});
    }
    if(!user){
      return res.status(401).json({msg: 'authentication did not go thru3'});
    }
    req.user = user;
    // console.log(JSON.stringify(req.user));
    next();
  });
};
