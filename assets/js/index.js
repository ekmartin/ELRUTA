require('./graph');

$('.ui.accordion').accordion();




var powerhackApp = angular.module('powerhack', []);

powerhackApp.run(function($rootScope) {

  $rootScope.meter = '0e6e348bfdb74432b6709526527c3d12';
  $rootScope.seriesType = 'ActivePlus';


  // Savings
  $rootScope.saving = {
    dateFrom: '2012-01-01',
    dateTo: '2014-03-20',
    intervalType: 'Day'
  };

});


powerhackApp.controller('demo-steinskjer', ['$scope', '$http', '$rootScope',
    function($scope, $http, $rootScope) {

        $http({method: 'GET', url: '/api/demo-steinskjer.json?meter=' + $rootScope.meter + '&seriesType=' + $rootScope.seriesType + '&dateFrom=' + $rootScope.saving.dateFrom + '&dateTo=' + $rootScope.saving.dateTo + '&intervalType=' + $rootScope.saving.intervalType})
          .success(function(data, status, headers, config) {

                alert(data);

          })
          .error(function(data, status, headers, config) {

          });


    }]);