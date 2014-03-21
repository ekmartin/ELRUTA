require('./graph');

var app = angular.module('powerhack', ['ngAnimate','ui.router']);

var categories = require('./savings.json')

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);

app.controller('MainController', ['$scope', function($scope) {
  var res = {};
  for (var key in categories) {
    res[key] = {
      id: key,
      name: key,
      subcategories: categories[key]
    }
  }

  $scope.categories = res;
  $scope.currentCategory = categories.water;
  $scope.currentSub = null;

  $scope.chooseCategory = function(category) {
    $scope.currentCategory = category;
    $scope.currentSub = null;
  };

  $scope.chooseSub = function(sub) {
    $scope.currentSub = sub;
  };

  $scope.getCurrentSettingsTemplate = function() {
    if ($scope.currentSub)
      return "partials/" + $scope.currentCategory.id + "." + $scope.currentSub.element.toLowerCase();
    return "partials/welcome";
  };
}]);
