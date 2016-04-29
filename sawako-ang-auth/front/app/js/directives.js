module.exports = function(app){

  app.directive('editFormForContinents', function(){
    return {
      restrict: 'E',
      templateUrl: '/templates/edit-form.html',
      controller: 'ContinentCtrl'
    };
  });

  app.directive('repeatConts', function(){
    return {
      restrict: 'E',
      templateUrl: '/templates/repeat-conts.html'
    };
  });

  app.directive('createGemForm', function(){
    return {
      restrict: 'E',
      templateUrl: '/templates/gem-form.html',
      controller: 'gemsController',
      controllerAs: 'gems'
    };
  });

  app.directive('editFormForGems', function(){
    return {
      restrict: 'E',
      templateUrl: '/templates/edit-gem-form.html',
      controller: 'gemsController',
      controllerAs: 'gems'
    };
  });

};
