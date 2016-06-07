var pickpal = angular.module('pickpal', [
  'ui.router',
  'ngAnimate',
  // 'YelpServices'
]);

// App routes
pickpal.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('pick', {
      url: '/pick',
      templateUrl: 'views/pick.html',
      controller: 'pickController'
    })
    .state('pick.location', {
      url: '/location',
      templateUrl: 'views/pick-location.html'
    })
    .state('pick.mood', {
      url: '/mood',
      templateUrl: 'views/pick-mood.html'
    })
    .state('pick.choose', {
      url: '/choose',
      templateUrl: 'views/pick-choose.html'
    });

  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('pick');
});

pickpal.controller('pickController', ['$scope', 'Yelp', function($scope, Yelp) {
  $scope.pickData = {};

  $scope.processForm = function() {
    console.log('inside processForm');
    console.log($scope.pickData);
    Yelp.getData($scope.pickData);
  }
}]);

// // SERVICES
pickpal.factory('Yelp', function($http) {
  return {
    getData: function(pickData) {
      console.log('whaddup bitch');
      $http({
        method: 'GET',
        url: '/api/pick',
        data: pickData
      }).then(function(data) {
        return;
      }, function(error) {
        console.error(error);
      })
    }
  }
});