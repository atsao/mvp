var pickpal = angular.module('pickpal', [
  'ui.router',
  'ngAnimate',
  'ngAutocomplete'
]);

// App routes
pickpal.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
      templateUrl: 'views/pick-choose.html',
      // resolve: {
      //   dataSuccess: function(Yelp) {
      //     return Yelp.getData({test: 'test'});
      //   }
      // }
    });

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('');
});

// pickpal.run(function($rootScope, $state, $urlRouter, Yelp) {
//   $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
//     console.log('event: ', event);
//     console.log('toState:', toState);
//     console.log('fromState: ', fromState);

//     if (toState.name === 'choose' && fromState.name === 'mood' && Yelp.dataSuccess === false) {
//       event.preventDefault();
//     } else {
//       console.log('test!');
//     }
//   });
// });

pickpal.controller('pickController', ['$scope', 'Yelp', function($scope, Yelp) {
  $scope.pickData = {};
  // $scope.pickData.term = 'food'; // default

  // Autocomplete parameters
  $scope.options = null;
  $scope.details = null;

  $scope.processForm = function() {
    // var deferred = $q.defer();
    // return Yelp.getData($scope.pickData).then(function(data) {
    //   console.log('success!: ');
    //   // return data;
    //   console.log('data!: ', data);
    //   deferred.resolve(data);
    // }).catch(function(error) {
    //   console.log('error!!!!!!!!: ');
    //   deferred.reject('error bish');
    // });

    // return deferred.promise;
    // $scope.data = JSON.stringify(Yelp.getData());
    return Yelp.getData($scope.pickData).then(function(data) {
      console.log('data: ', data);
      $scope.data = data;
    }, function(error) {
      console.error(error);
    });
  }

  $scope.startOver = function() {
    $scope.pickData.location = '';
    $scope.pickData.term = '';
    $scope.pickForm.$setPristine();
  }
}]);

// FACTORIES
pickpal.factory('Yelp', function(YelpService, $http) {
  var factory = {};

  // return {
    // dataSuccess: false,

    // getData: function(pickData) {
    //   console.log('whaddup bitch');
    //   return $http({
    //     method: 'GET',
    //     url: '/api/pick',
    //     data: pickData
    //   }).then(function(data) {
    //     console.log('factory data:', data);
    //     // this.dataSuccess = true;
    //     // console.log('this.data: ', this.dataSuccess);
    //     return data;
    //   }, function(error) {
    //     console.error(error);
    //     return error;
    //   });
    // }

  factory.getData = function(pickData) {
    if (pickData.term === null) { pickData.term = 'food'; };

    return $http({
      method: 'POST',
      url: '/api/pick',
      data: pickData,
      contentType: 'application/json'
    }).then(function(data) {
      return data;
    });
  };

  // factory.

  

  return factory;
});

// SERVICES
pickpal.service('YelpService', function($q) {
  return {
    requestData: function(httpPromise) {
      var deferred = $q.defer();
      httpPromise.then(function(data) {
        deferred.resolve(data);
      }, function() {
        deferred.reject('No data retrieved');
      });

      return deferred.promise;
    }
  }
});

// DIRECTIVES
pickpal.directive('formEnter', function() {
  return function(scope, element, attr) {
    element.bind('keydown keypress', function(e) {
      if (e.which == 13) {
        console.log('enter pressed!');
        scope.$apply(function() {
          scope.$eval(attr.formEnter);
        })
      }
      // return false;
      e.preventDefault();
    });
  }
});