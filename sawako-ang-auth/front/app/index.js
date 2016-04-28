'use strict';
const angular = require('angular');

require('angular-route');
const app = angular.module('myApp', ['ngRoute']);

require('./services/auth_service.js')(app);
require('./services/http_service.js')(app);
require('./js/directives.js')(app);

//Angular router
app.config(['$routeProvider', function(routeProvider){
  routeProvider
    .when('/signup',{
      controller: 'ContinentCtrl',
      controllerAs: 'conts',
      templateUrl: './templates/edit-form.html'
    })
    .when('/home', {
      controller: 'ContinentCtrl',
      controllerAs: 'conts',
      templateUrl: './templates/form.html'
    });
}]);

app.controller('ContinentCtrl',['ResourceService','AuthService','$location', function(ResourceService, AuthService, $location){
  var continentResource = ResourceService('continents');
  this.accountMng = [];
  this.continentsList = [];
  this.continents = [];
  this.allContinents = [];
  this.newConts = {
    country: '',
    region: '',
    mineral: ''
  };
  this.getCont = {};
  this.id = '';
  this.editing = false;
  this.buttonShow = false;
  this.deleting = false;
  this.fetchedData = [];

  this.cancelEdits = function(){
    this.getCont = this.fetchedData;
    console.log('back to original : ' + angular.toJson(this.fetchedData));
  };

  this.removeContFromArr = function(){
    this.allContinents = this.allContinents.filter((data)=>{
      return data._id !== this.id;
    });
  };

  this.getContinents = function(){
    continentResource.getAll()
    .then((result)=>{
      console.log('Here is result ' + result);
      this.continentsList = result.data;
      this.allContinents = angular.copy(result.data);
      console.log('Lets use them later : ' + this.allContinents);
    }, function(err){
      console.log(err);
    });
  };

  this.getByIdContinents = function(){
    this.buttonShow = true;
    continentResource.getById(this.id)
    .then((result)=>{
      this.getCont = result.data;
      this.fetchedData = angular.copy(result.data);
      console.log('Fetched data : ' + angular.toJson(this.fetchedData));
    }, function(err){
      console.log(err);
    });
  };

  this.createContinents = function(){
    continentResource.createOne(this.newConts)
    .then((result)=>{
      this.continents.push(result.data);
      console.log('Here is fromDB : ' + angular.toJson(this.continents));
    },function(err){
      console.log('err : ' + err);
    });
  };

  this.editContinents = function(){
    continentResource.editOne(this.id, this.getCont)
    .then((result)=>{
      this.getCont = result.data;
      this.status = 'Successfully updated : ' + angular.toJson(this.getCont);
      console.log('Here is result of PUT : ' + angular.toJson(this.getCont));
    }, function(err){
      console.log('err : ' + err);
    });
  };

  this.deleteContinentById = function(){
    this.deleting = true;
    this.removeContFromArr();
    console.log('Filtered array? : ' + angular.toJson(this.allContinents));
    console.log(this.deleting);
    continentResource.deleteOne(this.id, this.getCont)
    .then((result)=>{
      this.getCont = result.data;
      this.status = 'Successfully deleted : ' + angular.toJson(this.getCont);
    });
  };

  this.createPerson = function(user){
    AuthService.createUser(user, function(err, res){
      console.log('hitting');
      $location.path('/home');
    });
  };

  this.signUp = function(user){
    AuthService.createUser(user,function(err, res){
      $location.path('/home');
    });
  };
}]);

app.controller('gemsController',['ResourceService',function(ResourceService){
  var gemResource = ResourceService('gems');
  this.gemsList = [];
  this.gems = [];
  this.newGem = {
    name: '',
    color: '',
    density: ''
  };
  this.getGem = {};
  this.id = '';
  this.editing = false;
  this.buttonShow = false;
  this.deleting = false;
  this.allGems = [];
  this.fetchedData = [];

  this.cancelEdits = function(){
    this.getGem = this.fetchedData;
    console.log('back to original : ' + angular.toJson(this.fetchedData));
  };

  this.removeGemFromArr = function(){
    this.allGems = this.allGems.filter((data)=>{
      return data._id !== this.id;
    });
  };

  this.getGems = function(){
    gemResource.getAll()
    .then((result)=>{
      this.gemsList = result.data;
      this.allGems = angular.copy(result.data);
      console.log('Here is gemsList : ' + this.gemsList);
    }, function(err){
      console.log('Err : ' + err);
    });
  };

  this.getGemById = function(){
    gemResource.getById(this.id)
    .then((result)=>{
      this.buttonShow = true;
      this.getGem = result.data;
      this.fetchedData = angular.copy(result.data);
    }, function(err){
      console.log('Here is err : ' + err);
    });
  };

  this.createGems = function(){
    gemResource.createOne(this.newGem)
    .then((result)=>{
      this.gems.push(result.data);
      console.log('Here is new Gem! : ' + this.gems);
    }, function(err){
      console.log('Err : ' + err);
    });
  };

  this.editGem = function(){
    gemResource.editOne(this.id, this.getGem)
    .then((result)=>{
      this.getGem = result.data;
      this.status = 'Successfully updated : ' + angular.toJson(this.getGem);
    }, function(err){
      console.log('Here is err : ' + err);
    });
  };

  this.deleteGemById = function(){
    this.deleting = true;
    this.removeGemFromArr();
    console.log('Filtered array? : ' + angular.toJson(this.allGems));
    console.log(this.deleting);
    gemResource.deleteOne(this.id, this.getGem)
    .then((result)=>{
      this.getGem = result.data;
      this.status = 'Successfully deleted : ' + angular.toJson(this.getGem);
    }, function(err){
      console.log('Here is err : ' + err);
    });
  };
}]);
