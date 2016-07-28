'use strict';

/* Event Controller */

angular.module('peckbox')
  .controller('EventsCtrl', ['$scope', '$http', '$auth', 'Auth', 'toastr', '$location', function($scope, $http, $auth, Auth, toastr, $location) {
    $http.get('/api/me').success(function(data) {
      // $scope.user = data;
      console.log('data is', data);
      for (var index in data.events){
        var today = new Date();
        var dd = today.getDate();
        var dateNow = moment().format('YYYY-MM-DD');
        var momentDate = moment(data.events[index].date).utc().format('YYYY-MM-DD');
        var toastrDate = moment(data.events[index].date).utc().format('hh:mma');

        if( moment(data.events[index].date).utc().format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')){
          data.events[index].urgent = "urgent";
          toastr.warning('There is an event today @ ' + toastrDate);
        } else {
          data.events[index].urgent = "default";
        } 
         $scope.user = data;
      }
      console.log('momentDate is', momentDate)
      console.log('dateNow is', dateNow)
    // $scope.user = data;
    });


    $scope.event = {};
   
    // $scope.getDatetime = new Date();

    // if (event.date = getDateTime) {
    //   event.color = "urgent";
    //   console.log('getDateTime is', getDateTime);
    // }
    $scope.check = function(){
      if($scope.event.date <= Date.now()){
        event.color = "urgent"
      }
    }

    // $scope.urgent = function(event, urgent)
    //   {
    //     if (event.date <= Date.now()){
    //       $scope.urgent = "urgent";
    //     } else {
    //       $scope.urgent = "default";
    //     }
        
    //   };

      

    $scope.test = function(event, color) {
        // console.log(event);
        // overriding event model with color (String)
        if (color === "red") {
          event.color = "red";
        } else if (color === "blue"){
          event.color = "blue";
        } else if (color === "yellow"){
          event.color = "yellow";
        } else {
          event.color = "default";
        }
        
        $http.put('/api/events/'+ event._id, event)
        .success(function(response){
         // console.log(response);
       });
    };

    $scope.tabs = [{
                title: 'Event',
                url: 'event.tpl.html'
            },{
                title: 'Map',
                url: 'map.tpl.html'
        }];

        $scope.currentTab = 'event.tpl.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };
        
        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        };

    $scope.createEvent = function(user) {
     
        var body = {
            title : $scope.event.title,
            description  : $scope.event.description,
            location : $scope.event.location,
            date : $scope.event.date,
            userId: user._id,
            color: $scope.event.color,
            urgent: $scope.event.urgent,
        };
        console.log("front is", body);
        $http.post('/api/events', body)
        .success(function(response){
            toastr.success('You have successfully created an event!');
            console.log('response', response);
             $scope.user.events.unshift(response);
        })
        .error(function(response){
            console.log('err', response);
        });

    };

    $scope.editEvent = function(event){
        $scope.event = {
            title : $scope.event.title,
            description  : $scope.event.description,
            location : $scope.event.location,
            date : $scope.event.date,
            color: $scope.event.color,
            userId: user._id,
        };
        console.log('edit', $scope.event);
    };

    $scope.updateEvent = function(event){
       console.log('update', event)
       $http.put('/api/events/'+ event._id, event)
       .success(function(response){
         toastr.warning('You have successfully updated an event!');
         console.log(response)
         event.editForm = false;
       });
       // console.log('edit', event);
     };

   // $scope.createEvent = function() {
   //    console.log('scope.event is ', $scope.event);
   //    $scope.event.owner = $scope.currentUser;
   //    var event = new Event($scope.event);
   //    event.$save(function(data) {
   //      $scope.events.unshift(data);
   //      $scope.event = {};
   //      console.log('after save createEventForm is: ', $scope.createEvent);
   //    });
   // };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/events/' + event._id)
        .success(function(data) {
          toastr.error('You have successfully deleted an event!');
          var index = $scope.user.events.indexOf(event);
          $scope.user.events.splice(index,1);

        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.eventShow = function(event) {
      $location.path('/events/' + event._id );
    
    };


  }])

  .controller('EventShowCtrl', ['$scope', '$http', '$auth', 'Auth', '$location', '$routeParams', 'toastr', 'Event', '$q', '$window',function($scope, $http, $auth, Auth, $location, $routeParams, toastr, Event, $q, $window) {
    $http.get('/api/me').success(function(data) {
      $scope.user = data;
    });

    //go back button
      $scope.backButton = function() {
         $window.history.back();
      };

        // $scope.tabs = [{
        //         title: 'Comment',
        //         url: 'comment.tpl.html'
        //     },{
        //         title: 'Map',
        //         url: 'map.tpl.html'
        // }];

        // $scope.currentTab = 'map.tpl.html';

        // $scope.onClickTab = function (tab) {
        //     $scope.currentTab = tab.url;
        // };
        
        // $scope.isActiveTab = function(tabUrl) {
        //     return tabUrl == $scope.currentTab;
        // };

    Event.get({ id: $routeParams.id }, function(event) {
      $scope.event = event;
      $scope.comment = event.comments;
      console.log('outside', event);
    });

    $scope.eventColor = function(event, color) {

        console.log(event);
        // overriding event model with color (String)
        if (color === "red") {
          event.color = "red";
        } else if (color === "blue"){
          event.color = "blue";
        } else if (color === "yellow"){
          event.color = "yellow";
        } else {
          event.color = "default";
        }
        
        $http.put('/api/events/'+ event._id, event)
        .success(function(response){
         console.log(response);
       });
    };

    $scope.editEvent = function(event){
            $scope.event = {
                title : $scope.event.title,
                description  : $scope.event.description,
                location : $scope.event.location,
                date : $scope.event.date,
                color: $scope.event.color,
                userId: user._id,
            };
            console.log('edit', $scope.event);
        };

    $scope.updateEvent = function(event){
       console.log('update', event)
       $http.put('/api/events/'+ event._id, event)
       .success(function(response){
         toastr.warning('You have successfully updated an event!');
         console.log(response)
         event.editForm = false;
       });
       // console.log('edit', event);
     };
    
    $scope.createComment = function(event, user){
      var config = {
        body: $scope.comment.body,
        userId: user._id,
        event: event._id
      }

      console.log('config', config)
      $http.post('/api/event/' + event._id + '/comments', config)
      .success(function(response){
        toastr.success('You have successfully created a comment!');
        console.log('response is', response)
        $scope.event.comments.unshift(response);
        console.log('event comment is', event.comments)
      })
      .error(function(response){
        console.log('err', response)
      })
    }

    $scope.deleteComment = function(comment) {
      $http.delete('/api/events/' + comment.event + '/comments/' + comment._id)
        .success(function(data) {
          toastr.error('You have successfully deleted a comment!');
          var index = $scope.event.comments.indexOf(comment);
          $scope.event.comments.splice(index,1);

        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    $scope.updateComment = function(comment) {
     $http.put('/api/events/' + comment.event + '/comments/' + comment._id)
     .success(function(response){
       toastr.warning('You have successfully updated a comment!');
       console.log(response);
       comment.editForm = false;
     });
    };

    $scope.commentColor = function(comment, color) {

        console.log(comment);
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
        
        $http.put('/api/events/'+ comment.event + '/comments/' + comment._id, comment)
        .success(function(response){
         console.log(response);
       });
    };

  }]);


