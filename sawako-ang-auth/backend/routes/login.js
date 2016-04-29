'use strict';

module.exports = (router, User)=>{
  router.get('/signin', (req, res)=>{
    console.log(req.headers.authorization)
    let authorizationArray = req.headers.authorization.split(' ');
    let method = authorizationArray[0];
    let base64ed = authorizationArray[1];
    let authArray = new Buffer(base64ed, 'base64').toString().split(':');
    let username = authArray[0];
    let password = authArray[1];
    console.log('username is : ' + username, 'password is : ' + password, 'method is : ' + method);

    User.findOne({username : username}, (err, user)=>{
      console.log('Here is user :' + user);
      let valid = user.compareHash(password);
      if(!valid){
        return res.json({status: 'failure!'});
      }
      console.log({token: user.generateToken()});
      res.json({token: user.generateToken()});
    });
  });
};
