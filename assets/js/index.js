var graph = require('./graph');

$('.ui.accordion').accordion();




var powerhackApp = angular.module('powerhack', []);

powerhackApp.run(function($rootScope) {

  $rootScope.meter = '00afb551a68946bdb0e02fdbd5ac9356';
  $rootScope.seriesType = 'ActivePlus';


  // Savings
  $rootScope.saving = {
    dateFrom: '2011-11-01',
    dateTo: '2014-03-20',
    intervalType: 'Day'
  };

});


powerhackApp.controller('demo-steinskjer', ['$scope', '$http', '$rootScope',
    function($scope, $http, $rootScope) {
        $http({method: 'GET', url: '/api/demo-steinskjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType})
          .success(function(data, status, headers, config) {
            console.log("ingenting", '/api/demo-steinskjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType);
            graph.addLineGraph(data);
          })
          .error(function(data, status, headers, config) {
          });
    }]);
