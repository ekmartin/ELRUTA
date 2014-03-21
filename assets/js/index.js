require('./graph');

var app = angular.module('powerhack', ['ngAnimate', 'LocalStorageModule']);

var categories = require('./savings.json')


app.controller('MainController', ['$scope', 'localStorageService', function($scope, localStorageService) {
  var res = {};
  for (var key in categories) {
    res[key] = {
      id: key,
      name: key,
      subcategories: categories[key]
    }
  }

  $scope.categories = res;
  $scope.currentCategory = localStorageService.get('currentCategory');
  $scope.currentSub = null;

  $scope.chooseCategory = function(category) {
    $scope.currentCategory = category;
    localStorageService.add('currentCategory', category);
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
