'use strict';

module.exports = function(app) {

app.factory('dbRequests', ['$http', function($http) {
  let mainRoute = 'http://localhost:3000';

  function Resource(resourceName) {
    this.resourceName = resourceName;
  }

  Resource.prototype.addOne = function(data, auth) {
    return $http.post(`${mainRoute}/${this.resourceName}`, data, auth);
  }

  Resource.prototype.getOne = function(data, auth) {
    return $http.get(`${mainRoute}/${this.resourceName}/${data._id}`, auth);
  }

  Resource.prototype.getAll = function() {
    return $http.get(`${mainRoute}/${this.resourceName}`);
  };

  Resource.prototype.update = function(data, auth){
    return $http.put(`${mainRoute}/${this.resourceName}/${data._id}`, data, auth)
  }

  Resource.prototype.delete = function(data, auth) {
    return $http.delete(`${mainRoute}/${this.resourceName}/${data._id}`, auth);
  }

  return function(resourceName) {
    return new Resource(resourceName);
  }
}]);

}
