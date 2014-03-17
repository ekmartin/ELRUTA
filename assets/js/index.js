require('./graph');

var app = angular.module('powerhack', []);

app.controller('MainController', ['$scope', function($scope) {
  $scope.categories = {
    water: {
      name: 'water',
      info: 'Dusj mindre, eller dusj sammen.',
      title: 'Vann'
    },
    warming: {
      info: 'Knull mer, bruk ullfrotté aka bukse, under, lang.',
      title: 'Oppvarming'
    },
    electronics: {
      info: 'Play less, walk more.',
      title: 'Hjemmeelektronikk'
    }
  }

  $scope.currentCategory = null;

  $scope.switchCategory = function(category) {
    $scope.currentCategory = $scope.categories[category];
  };
}]);
