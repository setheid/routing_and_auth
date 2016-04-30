var angular = require('angular');
require('./../../build/app.js');
require('./../../build/api.js')
require('angular-mocks');

describe('api app', () => {
  var apiCtrl;
  var rootRoute = 'http://localhost:3000';
  // it('should have a test', () => {
  //   expect(false).toBe(false);
  // });
  beforeEach(angular.mock.module('app'));
  beforeEach(angular.mock.inject(function($controller) {
    apiCtrl = $controller('apiCtrl');
  }));
  it('should construct a controller', function() {
    expect(typeof apiCtrl).toBe('object');
  });
  describe('functions for player ajax requests', () => {
    var $httpBackend;
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    }));
    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get all players', () => {
      $httpBackend.expectGET(`${rootRoute}/players`)
        .respond(200, {players: [{name: 'test player1'}]});
      apiCtrl.getPlayers();
      $httpBackend.flush();
      expect(apiCtrl.players.length).toBe(1);
      expect(apiCtrl.players[0].name).toBe('test player1');
    });

    it('should create new player', () => {
      apiCtrl.players = [];
      $httpBackend.expectPOST(`${rootRoute}/players`)
      .respond(200, {player: {name: 'test player', alias: 'test_player', _id: '123'}});
      apiCtrl.addPlayer({name: 'test player', alias: 'test_player', _id: '123'});
      $httpBackend.flush();
      expect(apiCtrl.players.length).toBe(1);
      expect(apiCtrl.players[0].name).toBe('test player');
    });

    it('should update a player', () => {
      apiCtrl.players = [{name: 'test player', alias: 'test_player', _id: 123}];
      apiCtrl.players[0].edited = {newName: 'test player update', newAlias: 'test_player_update'};
      $httpBackend.expectPUT(`${rootRoute}/players/123`)
      .respond(200, 'player updated');
      apiCtrl.update(apiCtrl.players[0]);
      $httpBackend.flush();
      expect(apiCtrl.players[0].name).toBe('test player update');
      expect(apiCtrl.players[0].alias).toBe('test_player_update');
    });

    it('should delete a player', () => {
      apiCtrl.players = [{name: 'test player', alias: 'test_player', _id: '123'}];
      $httpBackend.expectDELETE(`${rootRoute}/players/123`)
      .respond(200, {message: 'player deleted'});
      apiCtrl.deletePlayer(apiCtrl.players[0]);
      $httpBackend.flush();
      expect(apiCtrl.players.length).toBe(0);
      expect(apiCtrl.players[0]).toBeUndefined();
    });
  });
  describe('functions for team ajax requests', () => {
    var $httpBackend;
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    }));
    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get all teams', () => {
      $httpBackend.expectGET(`${rootRoute}/teams`)
      .respond(200, {teams: [{name: 'test team'}]});
      $httpBackend.expectGET(`${rootRoute}/players`)
      .respond(200, {players: [{name: 'test player', alias: 'test_player'}]});
      apiCtrl.getTeams();
      $httpBackend.flush();
      expect(apiCtrl.teams.length).toBe(1);
      expect(apiCtrl.teams[0].name).toBe('test team');
    });

    it('should create a team', () => {
      apiCtrl.teams = [];
      $httpBackend.expectPOST(`${rootRoute}/teams`)
      .respond(200, {team: {name: 'test team', region: 'test', _id: '456'}});
      apiCtrl.addTeam({name: 'test'});
      $httpBackend.flush();
      expect(apiCtrl.teams.length).toBe(1);
      expect(apiCtrl.teams[0].name).toBe('test team');
      expect(apiCtrl.teams[0]._id).toBe('456');
    });

    it('should delete a team', () => {
      apiCtrl.teams = [{name: 'test team', _id: '456'}];
      $httpBackend.expectDELETE(`${rootRoute}/teams/456`)
      .respond(200, {message:'team deleted'});
      apiCtrl.deleteTeam(apiCtrl.teams[0]);
      $httpBackend.flush();
      expect(apiCtrl.teams.length).toBe(0);
      expect(apiCtrl.teams[0]).toBeUndefined();
    });
  });
});
