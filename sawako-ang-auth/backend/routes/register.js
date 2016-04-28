'use strict';

module.exports = (router, User)=>{
  router.post('/register', (req, res)=>{
    let newUser = new User({username: req.body.username, password: req.body.password});
    newUser.save((err, data)=>{
      if(err){
        return res.status(418).json({msg: 'I am a teapot. Not saved : ' + err});
      }
      var token = data.generateToken();
      res.json({token: token});
    });
  });
};
