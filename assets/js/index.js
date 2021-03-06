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

  $rootScope.paceCss = '/css/pace.default.css';

});

var categories = require('./savings.json');


app.controller('MainController', ['$scope', '$timeout', 'localStorageService', '$rootScope', '$http', '$interval', function($scope, $timeout, localStorageService, $rootScope, $http, $interval) {
  var res = {};
  for (var key in categories) {
    res[key] = {
      id: key,
      name: key,
      subcategories: categories[key]
    };
  }

  $scope.meterValue = 0;

  //Load default values from api
  $rootScope.loadDefaultValues = function() {
    $http({method: 'GET', url: '/api/demo-steinkjer-general.json?meter=' + $rootScope.meter})
      .success(function(data, status, headers, config) {
        $scope.meterValue = data.lastValue / 1000;
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

  $scope.switches = {
    dusj: [0.02, false],
    vaskemaskin: [0.01, false],
    vask: [0.01, false],
    oppvaskmaskin: [0.01, false],
    lysparer: [0.03, false],
    dimmer: [0.01, false],
    hjerne: [0.01, false],
    lyssensor: [0.015, false],
    elektronikk: [0.015, false],
    fryser: [0.01, false],
    kjoleskap: [0.01, false],
    fyring: [0.175, false],
    isolasjon: [0.175, false],
    gardiner: [0.025, false],
    temperatur: [0.01, false],
    stovsuger: [0.002, false]
  };

  $scope.titles = {
    electronics: 'Elektronikk',
    heating: 'Oppvarming',
    light: 'Lys',
    water: 'Vann'
  }

  $scope.factor = 0;
  $scope.wantedPrice = 0;

  $scope.proposeSavings = function() {
    proposed = [];
    for (var key in $scope.switches) {
      $scope.switches[key][1] = true;
      updateFactor();
      proposed.push(key);
      if ($scope.estimatedNextMonth() <= $scope.wantedPrice) break;
    }
    return proposed;
  };

  function updateFactor() {
    $scope.factor = 1 - Object.keys($scope.switches).reduce(function(accumulated, key) {
      return !!$scope.switches[key][1] ? accumulated + $scope.switches[key][0]
        : accumulated;
    }, 0);
    console.log("changing switch");
    graph.updateData($scope.factor);
    $scope.estimatedNextMonth();
  }

  $scope.$watch('switches', updateFactor, true);

  var meterValueTimer = function() {
    $scope.meterValue += 0.001;
    $timeout(meterValueTimer, 1000);
  };

  meterValueTimer();

  $scope.updateGraph = function(value) {
    graph.updateData(value);
  };

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
      return 'partials/' + $scope.currentCategory.id + '.' + $scope.currentSub.template;
    return 'partials/welcome';
  };

  $scope.kwhPrice = 40.5;
  $scope.calculateEarned = function(kwh, days) { // kwh: kwh du sparer, days: hvor lenge du skal spare, returnerer sparte kroner
    return (($scope.kwhPrice/100) * kwh * days);
  };

  // Kalkuler pris neste måned
  $scope.calculateNextMonth = function(data){
    var totalKiloWatt = 0;
    for (var i = 0; i<data.length; i++) {
      var value = data[i];
      var today = new Date();
      var month = today.getMonth()+2;
      if (month>12){
        month = 1;
      }
      var prefix = '-';
      if (month >= 1 && month <=9){prefix = '-0';}
      if (value.timeStamp.indexOf(((today.getYear() + 1900)-1) + prefix + month) != -1) {
        totalKiloWatt += value.value;
      }
    };

    $scope.nextMonth = $scope.calculateEarned(totalKiloWatt, 1);
  };

  $scope.estimatedNextMonth = function() {
    return $scope.nextMonth * $scope.factor;
  };


  $scope.calculatePrice = function(data) {
    return data.reduce(function(total, value) {
      return total + ($scope.kwhPrice/100 * value);
    });
  };

  $scope.currentView = 'Sparing';
  $scope.graphTypes = ['Sparing', 'Live', 'Årsforbruk'];
  $scope.loadLiveDataFunction = function(){
    $http({method: 'GET', url: '/api/demo-steinkjer.json?meter=' + $rootScope.realtime.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.realtime.date() + '&dateTo=' + $rootScope.realtime.date() + '&intervalType=' + $rootScope.realtime.intervalType})
      .success(function(data, status, headers, config) {
        graph.updateLiveData(data);
      })
      .error(function(data, status, headers, config) {
        console.log(arguments);
      });
  };

  $scope.data = null;

  $scope.loadDataFunction = function() {
    if ($scope.data != null) {
      graph.addLineGraph($scope.data);
    }
    else {
      $http({method: 'GET', url: '/api/demo-steinkjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType})
        .success(function(data, status, headers, config) {
          $scope.data = data;
          $scope.calculateNextMonth(data);
          $scope.wantedPrice = parseInt($scope.estimatedNextMonth());
          graph.addLineGraph(data);
        })
        .error(function(data, status, headers, config) {
          console.log(arguments);
      });
    }
  };

  var stop;
  $scope.loadLiveData = function(){
    if ( angular.isDefined(stop) ) return;

    $scope.loadLiveDataFunction();
    stop = $interval(function() {$scope.loadLiveDataFunction();}, 1000*60);

  };

  $scope.stopLiveData = function() {
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  };

  $scope.loadYearly = function() {
    if ($scope.data != null) {
      graph.addYearlyGraph($scope.data, false);
    }
    else {
      $http({method: 'GET', url: '/api/demo-steinkjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType})
        .success(function(data, status, headers, config) {
          $scope.data = data;
          $scope.calculateNextMonth(data);
          graph.addYearlyGraph(data, false);
        })
        .error(function(data, status, headers, config) {
          console.log(arguments);
      });
    }
  };

  $scope.changeGraphMode = function(mode) {
    $scope.currentView = mode;
    if (mode === 'Sparing'){
      $scope.stopLiveData();
      $scope.loadDataFunction();
    }
    else if (mode === 'Live'){
      $rootScope.paceCss = '/css/pace.simple.css';
      $scope.loadLiveData();
    }
    else if (mode === 'Årsforbruk') {
      $scope.stopLiveData();
      $scope.loadYearly();
    }
  };


  // Load graphs
  $scope.loadDataFunction();

  // Display Modes
  $scope.displayMode = function() {
    if ($scope.currentView != 'Sparing') {
      return "large-page";
    }
    else {
      return "";
    }
  };
  $scope.displayModeFooter = function() {
    if ($scope.currentView != 'Sparing') {
      return "hide";
    }
    else {
      return "";
    }
  };

}]);
