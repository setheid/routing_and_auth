module.exports = function(app) {
  app.factory('AuthService', ['$http', '$window', function($http, $window) {
    var token;
    var url = 'http://localhost:3000/api'
    var auth = {
      createUser(user, cb) {
        // console.log('IN AUTH SERVICE, USER : ', user);
        cb || function() {};
        $http.post(url + '/signup', user)
          .then((res) => {
            token = $window.localStorage.token = res.data.token;
            cb(null, res);
          }, (err) => {
            cb(err)
          })
      },

      getToken() {
        return token || $window.localStorage.token;
      },

      signIn(user, cb) {
        cb || function() {};
        $http.get(url + '/signin', {
          headers: {
            authorization: 'Basic '+ btoa(user.email + ':' + user.password)
          }
        }).then((res) => {
          token = $window.localStorage.token = res.data.token;
          cb(null, res);
        }, (err) => {
          cb(err)
        })
      },

      signOut(cb) {
        token = null;
        $window.localStorage.token = null;
        cb && cb(); //if(cb) cb();
      }
    }
    return auth;
  }])
};
