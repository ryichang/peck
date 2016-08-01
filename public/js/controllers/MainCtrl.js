'use strict';

/* MAIN Controller */

angular.module('peckbox')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'Auth', '$route', 'toastr', function ($scope, $rootScope, $location, $auth, $http, Auth, $route, toastr) {

  

    // LOGIN/REGISTER
    $scope.user = {};

    $scope.isAuthenticated = function() {
      $http.get('/api/me').then(function (data) {
        if (!!data.data) {
          $scope.currentUser = data.data;
        } else {
          $auth.removeToken();
        }
      }, function (data) {
        $auth.removeToken();
        $location.path('/');
      });
    };

    $scope.isAuthenticated();

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          // console.log(response)
          $auth.setToken(response);
          $scope.isAuthenticated();
          $scope.user = {};
          $('#login-modal').modal('hide');
          $location.path('/splash');
        })
        .catch(function(response) {
          // console.log(response)
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $auth.setToken(response.data.token);
          $scope.isAuthenticated();
          $scope.user = {};
          $('#login-modal').modal('hide');
          $location.path('/splash');
        })
        .catch(function(response) {
          // console.log(response)
        });
    };

    $scope.logout = function() {
      $auth.logout()
        .then(function() {
          $auth.removeToken();
          $scope.currentUser = null;
          $location.path('/');
        });
    };
   


    //FACEBOOK
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function() {
        //notify user they have succesfully logged in with facebook
        toastr.success('You have successfully signed in with ' + provider + '!');
        //set current user
        $scope.currentUser = Auth.currentUser();
        //set user
        $scope.user = $scope.currentUser;
        // console.log('user is', user);
        //hide login modal
        $('#login-modal').modal('hide');
        //check if on splash page
        if($route.current.loadedTemplateUrl === 'templates/splash') {
          //redirect to dashboard page
          $location.path('/splash');
        } else {
          //reload current page
          $route.reload(); 
        }
      })
      .catch(function(error) {
          if (error.error) {
            // popup error
            // toastr.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            toastr.error(error.data.message, error.status);
          } else {
            // toastr.error(error);
          }
        });
    };


    
  }]);
