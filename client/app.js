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
    });

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('home');
});

pickpal.controller('pickController', function($scope, Yelp) {
  $scope.pickData = {};
  $scope.data = [];
  $scope.choices = [];

  $scope.selection = -1;

  // Autocomplete parameters
  $scope.options = null;
  $scope.details = null;

  $scope.processForm = function() {
    return Yelp.getData($scope.pickData).then(function(results) {
      $scope.data = results.data.businesses;
      $scope.generateChoices();
      $scope.generateChoices();
      $scope.generateChoices();
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
    var index = Math.floor(Math.random() * $scope.choices.length);
    $scope.selection = index;
    $scope.makeChoice(index);
    $scope.$apply();
  }

  $scope.makeChoice = function($index) {
    $scope.$broadcast('timer-stop');
    $scope.selection = $index;
  }

  $scope.checkChoices = function() {
    return $scope.data.length > 0;
  }
});

// FACTORIES
pickpal.factory('Yelp', function(YelpService, $http) {
  var factory = {};

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
        scope.$apply(function() {
          scope.$eval(attr.formEnter);
        })
      }
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