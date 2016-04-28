module.exports = function(app){
  app.factory('ResourceService',['$http','AuthService',function($http,AuthService){
    var mainRoute = 'http://localhost:3000/';

    function Resource (resourceName){
      this.resourceName = resourceName;
    }

    Resource.prototype.getAll = function(){
      return $http.get(mainRoute + this.resourceName, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    Resource.prototype.getById = function(id){
      return $http.get(mainRoute + this.resourceName + '/' + id, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    Resource.prototype.createOne = function(data){
      return $http.post(mainRoute + this.resourceName, data, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    Resource.prototype.editOne = function(id, data){
      return $http.put(mainRoute + this.resourceName + '/' + id, data, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    Resource.prototype.deleteOne = function(id, data){
      return $http.delete(mainRoute + this.resourceName + '/' + id, data, {
        headers: {
          token: AuthService.getToken()
        }
      });
    };

    // Resource.prototype.createUserAcct = function(data){
    //   console.log('Service : ' + JSON.stringify(data));
    //   return $http.post(mainRoute + '/register', data, {
    //     headers: {
    //       token: AuthService.getToken()
    //     }
    //   });
    // };

    return function(resourceName){
      return new Resource(resourceName);
    };
  }]);
};
