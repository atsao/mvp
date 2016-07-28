var pickpal = angular.module('pickpal', [
  'ui.router',
  'ngAnimate',
  'ngAutocomplete',
  'timer'
]);

// App routes
pickpal.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      // templateUrl: 'index.html'
    })
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
      children: [{
        name: 'choose.choices',
        templateUrl: 'views/pick-choose-choices.html'
      }]
      // resolve: {
      //   dataSuccess: function(Yelp) {
      //     return Yelp.getData({test: 'test'});
      //   }
      // }
    });

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('home');
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

pickpal.controller('pickController', function($scope, Yelp) {
  $scope.pickData = {};
  $scope.data = [];
  $scope.choices = [];

  $scope.selection = -1;
  $scope.timedOut = false;
  $scope.choice = -1;

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
    return Yelp.getData($scope.pickData).then(function(results) {
      console.log('results: ', results);
      $scope.data = results.data.businesses;
      console.log('data!', $scope.data);
      $scope.generateChoices();
      $scope.generateChoices();
      $scope.generateChoices();
      console.log('Random choices:', $scope.choices);
    }, function(error) {
      console.error(error);
    });
  }

  $scope.startOver = function() {
    $scope.pickData.location = '';
    $scope.pickData.term = '';
    $scope.data = [];
    $scope.choices = [];
    $scope.selection = -1;
    $scope.pickForm.$setPristine();
  }

  $scope.generateChoices = function() {
    var index = Math.floor(Math.random() * $scope.data.length);
    $scope.choices.push($scope.data[index]);
    $scope.data.splice(index, 1);
  }

  $scope.timesUp = function() {
    console.log('Times\'s up!');
    var index = Math.floor(Math.random() * $scope.choices.length);
    $scope.selection = index;
    console.log('index: ', index);
    $scope.makeChoice(index);
    $scope.choice = index;
    console.log('selection: ', $scope.selection);
    console.log('choice: ', $scope.choice);
    $scope.timedOut = true;
    $scope.$apply();
  }

  $scope.makeChoice = function($index) {
    console.log('make choice ran: ');
    console.log('$index: ', $index);
    $scope.$broadcast('timer-stop');
    $scope.selection = $index;

    $scope.choice = $index;
  }

  $scope.checkChoices = function() {
    return $scope.data.length > 0;
  }
});

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

pickpal.directive('autofocus', function() {
  return {
    link: function($scope, $element, attrs) {
      setTimeout(function() {
        $element[0].focus();
      }, 100);
    }
  };
});