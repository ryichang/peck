'use strict';

// Declare app level module which depends on filters, and services
angular.module('peckbox', ['peckbox.services',
                              'ngRoute',
                              'ngResource',
                              'satellizer',
                              'google.places',
                              '720kb.datepicker',
                              'ngMap',
                              'sticky',
                              'toastr',
                              'angular-loading-bar',
                              'simpleAngularTicker',
                              'angularScreenfull',
                              ])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'templates/splash',
        controller: 'ApisCtrl'
      });


      // $routeProvider.when('/', {
      //         templateUrl: 'templates/splash',
      //         controller: 'GroupsCtrl'
      //       });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'UsersCtrl'
      });

      $routeProvider.when('/dashboard', {
        templateUrl: 'templates/dashboard',
        controller: 'UsersCtrl'
      });

      $routeProvider.when('/dashboard', {
        templateUrl: 'templates/dashboard',
        controller: 'NotesCtrl'
      });

      $routeProvider.when('/dashboard', {
        templateUrl: 'templates/dashboard',
        controller: 'PostsCtrl'
      });

      $routeProvider.when('/dashboard', {
        templateUrl: 'templates/dashboard',
        controller: 'EventsCtrl'
      });

      $routeProvider.when('/navbar', {
        templateUrl: 'templates/navbar',
        controller: 'UsersCtrl'
      });

      $routeProvider.when('/posts', {
        templateUrl: 'templates/post',
        controller: 'PostsCtrl'
      });

      $routeProvider.when('/notes', {
        templateUrl: 'templates/note',
        controller: 'NotesCtrl'
      });

      $routeProvider.when('/events', {
        templateUrl: 'templates/event',
        controller: 'EventsCtrl'
      });

      $routeProvider.when('/groups', {
        templateUrl: 'templates/group',
        controller: 'GroupsCtrl'
      });

      $routeProvider.when('/groups/:id', {
        templateUrl: 'templates/groupShow',
        controller: 'GroupShowCtrl'
      });

      $routeProvider.when('/posts/:id/comments', {
        templateUrl: 'templates/postShow',
        controller: 'PostsCtrl'
      });

      $routeProvider.when('/posts/:id/comments', {
        templateUrl: 'templates/postShow',
        controller: 'PostShowCtrl'
      });

      $routeProvider.when('/notes/:id/comments', {
        templateUrl: 'templates/noteShow',
        controller: 'NotesCtrl'
      });

      $routeProvider.when('/notes/:id/comments', {
        templateUrl: 'templates/noteShow',
        controller: 'NoteShowCtrl'
      });

      $routeProvider.when('/events/:id', {
        templateUrl: 'templates/eventShow',
        controller: 'EventsCtrl'
      });

      $routeProvider.when('/events/:id', {
        templateUrl: 'templates/eventShow',
        controller: 'EventShowCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/'});

      $locationProvider.html5Mode(true);
    }])

    

     .config(function($authProvider, $windowProvider) {
      var $window = $windowProvider.$get();
      if ($window.location.host == 'localhost:1337') {
        console.log('development app');
        $authProvider.facebook({        
          clientId: '202500220147892',
        });
        $authProvider.google({
          clientId: '244786553723-b9kn0lleakk061ggih9ji1cihcgsh0a3.apps.googleusercontent.com',
        });
      } else {
        console.log('production app');
        $authProvider.facebook({        
          clientId: '202500220147892',
        });
        $authProvider.google({
          clientId: '244786553723-b9kn0lleakk061ggih9ji1cihcgsh0a3.apps.googleusercontent.com',
        });
      }
    
    });
