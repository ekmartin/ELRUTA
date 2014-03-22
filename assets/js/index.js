var graph = require('./graph');

var app = angular.module('powerhack', ['ngAnimate', 'LocalStorageModule']);

app.run(function($rootScope, $http) {

  $rootScope.meter = '0704c0b2685a411a9cc69956dedb551e';
  $rootScope.seriesType = 'ActivePlus';

  // Savings
  $rootScope.saving = {
    dateFrom: '2012-01-01',
    dateTo: '2014-03-20',
    intervalType: 'Day'
  };

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


app.controller('MainController', ['$scope', '$timeout', 'localStorageService', '$rootScope', '$http', '$interval', function($scope, $timeout, localStorageService, $rootScope, $http, $interval) {
  var res = {};
  for (var key in categories) {
    res[key] = {
      id: key,
      name: key,
      subcategories: categories[key]
    }
  }

  $scope.meterValue = 0;

  //Load default values from api
  $rootScope.loadDefaultValues = function() {
    $http({method: 'GET', url: '/api/demo-steinkjer-general.json?meter=' + $rootScope.meter})
      .success(function(data, status, headers, config) {
        $scope.meterValue = data.lastValue;
        console.log(data.usageLastYear, "DUE ER HER!!");
        $scope.yearUsage = data.usageLastYear/1000;

      })
      .error(function(data, status, headers, config) {
      });
  };
  $rootScope.loadDefaultValues();

  $scope.categories = res;
  $scope.currentCategory = localStorageService.get('currentCategory');
  $scope.currentSub = null;



  $scope.household = {
    persons: 2,
    rooms: 4
  };

  $scope.changeFactor = 1.0;

  $scope.$watch('changeFactor', function() {
    graph.updateData(Math.max(0.1, $scope.changeFactor));
  });

  var meterValueTimer = function() {
    $scope.meterValue += 1;
    $timeout(meterValueTimer, 3000);
  };

  meterValueTimer();

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
      return "partials/" + $scope.currentCategory.id + "." + $scope.currentSub.template;
    return "partials/welcome";
  };


  /* Kalkulerer priser */
  $scope.kwhPrice = 40.5; // Øre pr kwh
  $scope.calculateEarned = function(kwh, days) { // kwh: kwh du sparer, days: hvor lenge du skal spare, returnerer sparte kroner
    return (($scope.kwhPrice/100) * kwh * days);
  }
  $scope.calculatePrice = function(data) { // Tar data fra apiet inn og returnerer pris
    var total = 0;
    for (var i = 0; i<data.length; i++) {
      total += (($scope.kwhPrice/100) * data[i].value);
    }
    return total;
  }




  /* Change Graph */
  $scope.graphTypes = ['Sparing', 'Live'];
  $scope.loadLiveDataFunction = function(){
    $http({method: 'GET', url: '/api/demo-steinskjer.json?meter=' + $rootScope.realtime.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.realtime.date() + '&dateTo=' + $rootScope.realtime.date() + '&intervalType=' + $rootScope.realtime.intervalType})
      .success(function(data, status, headers, config) {
        console.log(data);
      })
      .error(function(data, status, headers, config) {
      });
  };
  $scope.loadDataFunction = function() {
    $http({method: 'GET', url: '/api/demo-steinskjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType})
      .success(function(data, status, headers, config) {
        console.log("ingenting", '/api/demo-steinskjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType);
        graph.addLineGraph(data);
      })
      .error(function(data, status, headers, config) {
        console.log("feil");
      });
  };

  var stop;
  $scope.loadLiveData = function(){
    if ( angular.isDefined(stop) ) return;

    $scope.loadLiveDataFunction();
    stop = $interval(function() {$scope.loadLiveDataFunction();}, 1000*3);

  };
  $scope.stopLiveData = function() {
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  };


  $scope.changeGraphMode = function(mode) {
    if (mode === 'Sparing'){
      $scope.stopLiveData();
      $scope.loadDataFunction();
    }
    else if (mode === 'Live'){
      $scope.loadLiveData();
    }
  };


  // Load graphs
  $scope.loadLiveDataFunction();
  $scope.loadDataFunction();

}]);
