var graph = require('./graph');

var app = angular.module('powerhack', ['ngAnimate', 'LocalStorageModule']);

app.run(function($rootScope) {

  $rootScope.meter = '0704c0b2685a411a9cc69956dedb551e';
  $rootScope.seriesType = 'ActivePlus';


  // Savings
  $rootScope.saving = {
    dateFrom: '2012-01-01',
    dateTo: '2014-03-20',
    intervalType: 'Day'


  // RealTime
  $rootScope.realtime = {
    meter: "0e6e348bfdb74432b6709526527c3d12",
    date: function() {
      return moment().format('YYYY-MM-DD');
    },
    intervalType: "Minute"
  };

});

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
};

app.controller('demo-steinskjer', ['$scope', '$http', '$rootScope',
  function($scope, $http, $rootScope) {
      $http({method: 'GET', url: '/api/demo-steinskjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType})
        .success(function(data, status, headers, config) {
          console.log("ingenting", '/api/demo-steinskjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType);
          graph.addLineGraph(data);
        })
        .error(function(data, status, headers, config) {
          console.log("feil");
        });
  }
]);

app.controller('demo-steinskjer-realtime', ['$scope', '$http', '$rootScope',
  function($scope, $http, $rootScope) {
    var getData = setInterval(function(){
    $http({method: 'GET', url: '/api/demo-steinskjer.json?meter=' + $rootScope.realtime.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.realtime.date() + '&dateTo=' + $rootScope.realtime.date() + '&intervalType=' + $rootScope.realtime.intervalType})
      .success(function(data, status, headers, config) {
        // Got data :)
      })
      .error(function(data, status, headers, config) {
      });
    }, 1000*60);
  }
]);
