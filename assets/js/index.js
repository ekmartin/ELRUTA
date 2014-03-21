require('./graph');

$('.ui.accordion').accordion();




var powerhackApp = angular.module('powerhack', []);


powerhackApp.controller('demo-steinskjer', ['$scope', '$http',
    function($scope, $http) {

        $http({method: 'GET', url: 'http://google.no'}).
            success(function(data, status, headers, config) {

                alert('data');

            }).
            error(function(data, status, headers, config) {
            });


    }]);