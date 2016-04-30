'use strict';

module.exports = function(app) {

app.factory('AuthService', ['$http', '$window', function($http, $window) {
  var url = 'http://localhost:3000'
  var token = null;
  var user;

  var auth = {
    getUser() {
      if (user) return user;
      if (token || $window.localStorage.token) {
        token = token || $window.localStorage.token;
        $http.get(url +'/validate', {
          headers: { token: token }
        })
        .then(res => {
          console.log(res.data.user);
          user = res.data.user;
          return user;
        });
      }
    },

    login(user, cb) {
      $http.get(url + '/login', {
        headers: { authorization: 'Basic ' + btoa(user.username + ':' + user.password) } //binary to ascii
      })
      .then(res => {
        token = $window.localStorage.token = res.data.token;
        user = res.data.user;
        // console.log(user);
        if (cb) cb(null, res);
      }, () => {
        token = null;
      });
    },

    getToken() {
      return token || $window.localStorage.token;
    },

    logout(cb) {
      token = null;
      delete $window.localStorage.token;
      if (cb) cb();
    }
  }

  return auth;

}]);

}
