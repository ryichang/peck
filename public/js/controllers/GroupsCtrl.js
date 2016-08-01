'use strict';

/* Group Controller */

angular.module('peckbox')
  .controller('GroupsCtrl', ['$scope', '$http', '$auth', 'Auth', 'toastr', '$location', function($scope, $http, $auth, Auth, toastr, $location) {
    $http.get('/api/me').success(function(data) {
      $scope.user = data;
    });

    $scope.group = {};

    $http.get('/api/groups').success(function(data){
      // console.log('group is', data)
      $scope.groups = data;
    });

    $scope.test = function(group, color) {

        // console.log(event);
        // overriding event model with color (String)
        if (color === "red") {
          group.color = "red";
        } else if (color === "blue"){
          group.color = "blue";
        } else if (color === "yellow"){
          group.color = "yellow";
        } else {
          group.color = "default";
        }
        
        $http.put('/api/groups/'+ group._id, group)
        .success(function(response){
         // console.log(response);
       });
    };

    $scope.createGroup = function(user) {
     
        var body = {
            title : $scope.group.title,
            description  : $scope.group.description,
            date : $scope.group.date,
            owner: user._id,
            users: user._id,
            color: $scope.group.color,
        };
        console.log("front is", body);
        $http.post('/api/groups', body)
        .success(function(response){
            toastr.success('You have successfully created a group!');
            // console.log('response', response);
             $scope.groups.unshift(response);
        })
        .error(function(response){
            console.log('err', response);
        });
    };

    $scope.editGroup = function(group){
        $scope.group = {
            title : $scope.group.title,
            description  : $scope.group.description,
            date : $scope.group.date,
            color: $scope.group.color,
        };
        // console.log('edit', $scope.group);
    };

    $scope.updateGroup = function(group){
       console.log('update', group)
       $http.put('/api/groups/'+ group._id, group)
       .success(function(response){
         toastr.warning('You have successfully updated a group!');
         // console.log(response)
         group.editForm = false;
       });
       // console.log('edit', event);
     };

    $scope.deleteGroup = function(group) {
      $http.delete('/api/groups/' + group._id)
        .success(function(data) {
          // console.log('data is', data)
          toastr.error('You have successfully deleted a group!');
          var index = $scope.groups.indexOf(group);
          $scope.groups.splice(index,1);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.groupShow = function(group) {
      $location.path('/groups/' + group._id);
    
    };

  }])

  .controller('GroupShowCtrl', ['$scope', '$http', '$auth', 'Auth', '$location', '$routeParams', 'toastr', 'Group', 'Event','$window','$q', function($scope, $http, $auth, Auth, $location, $routeParams, toastr, Group, Event, $window, $q) {
    $http.get('/api/me').success(function(data) {
      $scope.user = data;
      Group.get({ id: $routeParams.id }, function(group) {
        $scope.group = group;
        $scope.comment = group.comments;
        $scope.event = group.events;
        console.log('outside', group);
        var users = $scope.group.users
       
        if ($scope.group.owner == $scope.user._id){
           $scope.Owner = true
           // console.log('owner', $scope.Owner) 
         }else {
           $scope.Owner = false
           // console.log('false', $scope.Owner)
         }

        for (var user in users){
          // console.log('users[user] id is', users[user]._id)
          if(users[user]._id == $scope.user._id){
            $scope.userFound = true;
            // console.log('userFound is', $scope.userFound)
            break;
          } else {
            $scope.userFound = false;
            // console.log('userFound is', $scope.userFound)
          }
        }

      });

    });

    $scope.userFound = false;

  
    //go back button
      $scope.backButton = function() {
         $window.history.back();
      };

    $scope.joinGroup = function(group, user){
      // console.log('group is', group)
      // console.log('user is', user)

      var body = {
        users: user._id,
      }

      // console.log('body is', body)

      $http.post('/api/groups/' + group._id, body)
      .success(function(response){
        toastr.success('You have successfully joined a group!');
            // console.log('response', response);
            // $scope.group.users.unshift(response.users[0].displayName);
             // $scope.group.users.unshift(response.users[0]);
             $window.location.reload();
             // $http.post('/api/groups')
             // $scope.groups.unshift(response);
      })
      .error(function(response){
            console.log('err', response);
        });

    };

    $scope.unjoinGroup = function(group, user){
      // console.log('group is', group)
      // console.log('user is', user)

      var body = {
         userId: user._id,
         groupId: group._id,
      }

      // console.log('body is', body)

      $http.put('/api/groups/' + group._id + '/unjoin', body)
      .success(function(response){
        toastr.success('You have successfully unjoined a group!');
            // console.log('response', response);
            var users = $scope.group.users
            for (var userIndex in users){
              if(users[userIndex] == user._id){
                $scope.group.users.splice(userIndex, 1)
              }
            }
            $window.location.reload(); 
      })
      .error(function(response){
            console.log('err', response);
        });
    };



    $scope.test = function(group, color) {

        console.log(group);
        // overriding group model with color (String)
        if (color === "red") {
          group.color = "red";
        } else if (color === "blue"){
          group.color = "blue";
        } else if (color === "yellow"){
          group.color = "yellow";
        } else {
          group.color = "default";
        }
        
        $http.put('/api/groups/'+ group._id, group)
        .success(function(response){
         // console.log(response);
       });
    };

    $scope.tabs = [{
                title: 'Comment',
                url: 'comment.tpl.html'
            },{
                title: 'Event',
                url: 'event.tpl.html'
            },{
                title: 'Map',
                url: 'map.tpl.html'
          }];

        $scope.currentTab = 'comment.tpl.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };
        
        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };  

    $scope.editGroup = function(group){
        $scope.group = {
            userId: group.userId[0],
            _id: group._id,
            title: group.title,
            description: group.description
        };
        // console.log('edit', $scope.group);
    };

    $scope.updateGroup = function(group){
      // console.log("Color: "+group.color)
       $http.put('/api/groups/'+ group._id, group)
       .success(function(response){
         toastr.warning(group.title + ' has been updated!');
       
         group.editForm = false;
       });
       // console.log('edit', group);
     };

     $scope.createComment = function(group, user){
       var config = {
         body: $scope.comment.body,
         userId: user._id,
         groupId: group._id
       };

       // console.log('config', config);
       $http.post('/api/group/' + group._id + '/comments', config)
       .success(function(response){
         toastr.success('Comment has been added in ' + group.title);
         // console.log('response is', response);
         $scope.group.comments.unshift(response);
         // console.log('group comment is', group.comments);
       })
       .error(function(response){
         console.log('err', response);
       });
     };

     $scope.deleteComment = function(comment) {
       $http.delete('/api/groups/' + comment.groupId + '/comments/' + comment._id, comment)
         .success(function(data) {
           toastr.error('Comment has been deleted in group!');
           var index = $scope.group.comments.indexOf(comment);
           $scope.group.comments.splice(index,1);

         })
         .error(function(data) {
           // console.log('Error: ' + data);
         });
     };

     $scope.updateComment = function(comment) {
      $http.put('/api/groups/' + comment.groupId + '/comments/' + comment._id, comment)
      .success(function(response){
        toastr.warning('Comment has been updated in group!');
        // console.log(response);
        comment.editForm = false;
      });
     };

     $scope.commentColor = function(comment, color) {

         // overriding post model with color (String)
         if (color === "red") {
           comment.color = "red";
         } else if (color === "blue"){
           comment.color = "blue";
         } else if (color === "yellow"){
           comment.color = "yellow";
         } else {
           comment.color = "default";
         }
         
         $http.put('/api/groups/'+ comment.groupId + '/comments/' + comment._id, comment)
         .success(function(response){

        });
     };

    $scope.createEvent = function(group, user){
      var config = {
        title: $scope.event.title,
        description: $scope.event.description,
        location: $scope.event.location,
        date: $scope.event.date,
        userId: user._id,
        groupId: group._id
      };

 
      $http.post('/api/group/' + group._id + '/events', config)
      .success(function(response){
        toastr.success('Event has been successfully added in ' + group.title);
        // console.log('event added is', response);
        $scope.group.events.unshift(response);
        // console.log('group event is', group.events);
      })
      .error(function(response){
       
      });
    };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/groups/' + event.groupId + '/events/' + event._id, event)
        .success(function(data) {
          toastr.error('Event has been deleted in group!');
          var index = $scope.group.events.indexOf(event);
          $scope.group.events.splice(index,1);

        })
        .error(function(data) {
          // console.log('Error: ' + data);
        });
    };

    $scope.updateEvent = function(event) {
     $http.put('/api/groups/' + event.groupId + '/events/' + event._id, event)
     .success(function(response){
       toastr.warning('Event has been updated in group!');
       // console.log(response);
       event.editForm = false;
     });
    };

    $scope.eventColor = function(event, color) {

        // overriding post model with color (String)
        if (color === "red") {
          event.color = "red";
        } else if (color === "blue"){
          event.color = "blue";
        } else if (color === "yellow"){
          event.color = "yellow";
        } else {
          event.color = "default";
        }
        
        $http.put('/api/groups/'+ event.groupId + '/events/' + event._id, event)
        .success(function(response){

       });
    };

  }]);
