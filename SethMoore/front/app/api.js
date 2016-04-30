'use strict';

(function() {

let app = angular.module('api', []);
require('./services/api_service')(app);
require('./services/auth_service')(app);
require('./services/error_service')(app);

app.controller('playersCtrl',
['dbRequests', 'AuthService', 'ErrorService', '$location',
function(dbRequests, AuthService, ErrorService, $location) {

  let _this = this;
  let db = dbRequests('players');

  _this.error = ErrorService(null);
  _this.players = [];

  _this.getPlayers = () => {
    db.getAll()
    .then(res => {
      _this.players = res.data.players;
      _this.players.sort((a, b) => a.position - b.position);
    }, err => console.log(err));
  }

  function resetAddPlayer() {
    _this.newPlayer = {};
  }

  _this.addPlayer = player => {
    if (player.current_team) player.current_team = player.current_team.replace(/\s+/g,'_');
    db.addOne(player, {
      headers: { token: AuthService.getToken() }
    })
    .then(res => {
      let newPlayer = res.data.player;
      newPlayer.makeEdit = false;
      _this.players.push(newPlayer);
      resetAddPlayer();
      console.log(res.data.message);
    }, err => {
      resetAddPlayer();
      _this.error = ErrorService('You do not have the authorization to add a player');
    });
  }

  _this.update = player => {
    player.name = player.edited.newName ? player.edited.newName : player.name;
    player.alias = player.edited.newAlias ? player.edited.newAlias : player.alias;
    player.position = player.edited.newPosition ? player.edited.newPosition : player.position;
    player.country = player.edited.newCountry ? player.edited.newCountry : player.country;
    player.current_team = player.edited.newTeam ? player.edited.newTeam.replace(/\s+/g,'_') : player.current_team;
    delete player.edit;
    db.update(player, {
      headers: { token: AuthService.getToken() }
    })
    .then(res => {
      console.log(res.data);
      player.makeEdit = false;
      player.edited = {};
    }, err => {
      console.log(err);
    });
  }

  _this.deletePlayer = player => {
    db.delete(player, {
      headers: { token: AuthService.getToken() }
    })
    .then(res => {
      _this.players = _this.players.filter(ele => ele._id != player._id);
      console.log(res.data.message);
    }, err => console.log(err));
  }
}]);

app.controller('teamsCtrl', ['dbRequests', function(dbRequests) {
  let _this = this;
  let db = dbRequests('teams');

  _this.teams = [];

  _this.getTeams = () => {
    db.getAll()
    .then(res => {
      _this.teams = res.data.teams;
      _this.teams.forEach(team => team.confirm = false);
    }, err => console.log(err));
  }

  _this.addTeam = team => {
    if (!team.name) return;
    team.name = team.name.replace(/\s+/g,'_');
    db.addOne(team)
    .then(res => {
      _this.teams.push(res.data.team);
      resetAddTeam();
      console.log(res.data.message);
    }, err => console.log(err));
  }

  function resetAddTeam() {
    _this.newTeam = {};
  }

  _this.deleteTeam = team => {
    db.delete(team)
    .then(res => {
      console.log(res.data.message);
      _this.teams = _this.teams.filter(ele => ele._id !== team._id);
    }, err => console.log(err));
  }
}]);

})();
