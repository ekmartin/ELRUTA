require('./graph');

var app = angular.module('powerhack', ['ngAnimate','ui.router']);

var categories = {
  'water': {
    id: 'water',
    name: 'Vann',
    sub: ['Dusj', 'Badekar', 'Vask', 'Oppvask']
  },
  'temperature': {
    id: 'temperature',
    name: 'Temperatur',
    sub: ['Dusj', 'Badekar', 'Vaskemaskin']
  },
  'electronics': {
    id: 'electronics',
    name: 'Elektronikk',
    sub: ['PC', 'TV', 'Kaffetrakter']
  },
  'other': {
    id: 'other',
    name: 'Annet',
    sub: ['Bil', 'Test', 'Båt']
  }
};

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]);

// app.config(function($stateProvider, $urlRouterProvider) {
//   $urlRouterProvider.otherwise('/');
//   $stateProvider
//     .state('categories', {
//       abstract: true,
//       url: '/categories',
//       templateUrl: 'partials/category'
//     })
//
//     .state('categories.show', {
//       url: '/:category',
//       templateUrl: 'partials/category',
//       controller: function($scope, $stateParams) {
//         console.log("H")
//       }
//     })
//
//     .state('categories.show.settings', {
//       url: '/:sub',
//       templateUrl: 'partials/settings',
//       controller: function($scope, $stateParams) {
//         console.log("State params", $stateParams);
//       }
//     })
// });

app.controller('MainController', ['$scope', function($scope) {
  $scope.categories = categories;
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
    if ($scope.currentSub) {
      return "partials/" + $scope.currentCategory.id + "." + $scope.currentSub.toLowerCase();
    }
    return "partials/welcome";
  };
}]);
