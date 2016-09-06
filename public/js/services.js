
'use strict';

/* Services */

angular.module('peckbox.services', [])

  .factory('Auth', ['$auth', function ($auth) {
    return {
      currentUser: function() {
        var user = $auth.getPayload();
        if(user){
        var currentUser = {
          _id: user.sub,
          email: user.email,
          picture: user.picture,
          displayName: user.displayName
          };
        }
        return currentUser;
      }
    };
  }])

  .factory('Post', function ($window, $resource) {
     return $resource($window.location.origin + '/api/posts/:id', { id: '@id' }, {
       update: { method: 'PUT'}
     });
   })

  .factory('Note', function ($window, $resource) {
     return $resource($window.location.origin + '/api/notes/:id', { id: '@id' }, {
       update: { method: 'PUT'}
     });
   })

  .factory('Event', function ($window, $resource) {
     return $resource($window.location.origin + '/api/events/:id', { id: '@id' }, {
       update: { method: 'PUT'}
     });
   })

  .factory('Comment', function ($window, $resource) {
     return $resource($window.location.origin + '/api/comments/:id', { id: '@id' }, {
       update: { method: 'PUT'}
     });
   })

  .factory('Group', function ($window, $resource) {
     return $resource($window.location.origin + '/api/groups/:id', { id: '@id' }, {
       update: { method: 'PUT'}
     });
   });

//    .factory('Post', function($resource, $window) {
//   return $resource('/api/posts/:id', { id: '@_id'}, {
//     update: {
//       method: 'PUT' // this method issues a PUT request
//     },
//     delete: {
//       method: 'DELETE'
//     }
//   });
// });
