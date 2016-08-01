'use strict';

/* USERS Controllers */

angular.module('peckbox')
  .controller('UsersCtrl', ['$scope', '$http', '$auth', 'Auth', function($scope, $http, $auth, Auth) {
    $http.get('/api/me').success(function(data) {
      $scope.user = data;
    });

    $scope.tabs = [{
                title: 'Note',
                url: 'one.tpl.html'
            }, {
                title: 'Task',
                url: 'two.tpl.html'
            }, {
                title: 'Event',
                url: 'three.tpl.html'
        }];

        $scope.currentTab = 'one.tpl.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };
        
        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };
   

  }]);