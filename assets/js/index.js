require('./graph');

var app = angular.module('powerhack', ['ngAnimate', 'ngRoute']);

var categories = {
  'water': {
    name: 'Vann',
    sub: ['Dusj', 'Badekar', 'Vask', 'Oppvask']
  },
  'temperature': {
    name: 'Temperatur',
    sub: ['Dusj', 'Badekar', 'Vaskemaskin']
  },
  'electronics': {
    name: 'Elektronikk',
    sub: ['PC', 'TV', 'Kaffetrakter']
  },
  'other': {
    name: 'Annet',
    sub: ['Bil', 'Test', 'Båt']
  }
};

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'test.html',
      controller: 'MainController'
    });
});

app.controller('MainController', ['$scope', function($scope) {
  $scope.categories = categories;
  $scope.currentCategory = categories.water;

  $scope.chooseCategory = function(category) {
    $scope.currentCategory = category;
  };
}]);
