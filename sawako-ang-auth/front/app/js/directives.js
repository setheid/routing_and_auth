module.exports = function(app){
  app.directive('createContinentForm', function(){
    return {
      restrict: 'E',
      templateUrl: '/templates/form.html',
      controller: 'ContinentCtrl',
      controllerAs: 'conts'
    };
  });

  app.directive('editFormForContinents', function(){
    return {
      restrict: 'E',
      templateUrl: '/templates/edit-form.html',
      controller: 'ContinentCtrl',
      controllerAs: 'conts'
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
