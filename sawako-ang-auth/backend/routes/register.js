'use strict';

module.exports = (router, User)=>{
  router.post('/register', (req, res)=>{
    let authorizationArray = req.headers.authorization.split(' ');
    let method = authorizationArray[0];
    let base64ed = authorizationArray[1];
    let authArray = new Buffer(base64ed, 'base64').toString().split(':');
    let name = authArray[0];
    let password = authArray[1];
    let newUser = new User({name: name, password: password});
    newUser.save((err, data)=>{
      if(err){
        return res.status(418).json({msg: 'I am a teapot. Not saved : ' + err});
      }
      res.json(data);
    });
  });
};
