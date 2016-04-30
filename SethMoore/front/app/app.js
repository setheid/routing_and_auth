'use strict';

(function() {

let angular = require('angular');
require('angular-route')
require('./api');

let app = angular.module('app', ['ngRoute', 'api']);
require('./services/auth_service')(app);

app.controller('appCtrl', ['AuthService', '$window', '$location', function(AuthService, $window, $location) {
  let _this = this;
  _this.loggedIn = $window.localStorage.token ? true : false;
  _this.user = AuthService.getUser();

  if (_this.loggedIn) $location.path('/home');
  else $location.path('/login');

  _this.login = user => {
    AuthService.login(user, (err, res) => {
      if (res.data.token) _this.loggedIn = true;
      _this.user = res.data.user;
      $location.path('/home');
    });
  }

  _this.logout = () => {
    AuthService.logout(() => {
      _this.loggedIn = false;
      $location.path('/login');
    });
  }

  _this.edit = player => player.makeEdit = !player.makeEdit;

  _this.confirmDel = team => team.confirm = !team.confirm;

  _this.cancel = player => {
    player.edited = {};
    player.makeEdit = false;
  }

}]);

app.directive('teamsList', () => {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/teams-list.html'
  }
});

app.directive('playerView', () => {
  return {
    restrict: 'A',
    templateUrl: 'views/player-view.html'
  }
});

app.directive('addPlayer', () => {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/add-player.html'
  }
});

app.directive('addTeam', () => {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/add-team.html'
  }
});

app.config(['$routeProvider', function(router) {
  router
  .when('/login', {
    templateUrl: 'views/login.html'
  })
  .when('/home', {
    templateUrl: 'views/home.html'
  })
}]);

})();
