'use strict';

/* POST Controllers */

angular.module('peckbox')
  .controller('PostsCtrl', ['$scope', '$http', '$auth', 'Auth', '$location', '$routeParams', 'toastr', 'Post', '$q', function($scope, $http, $auth, Auth, $location, $routeParams, toastr, Post, $q) {
    $http.get('/api/me').success(function(data) {
      $scope.user = data;
      // var tasks = data.posts.length;
      // if (tasks === "1") {
      //   toastr.warning('You have one task to complete!');
      // } else (tasks > "1"){
      //   toastr.warning('You have ' + tasks + ' tasks to complete!');
      // } 
    });


    $scope.post = {};

    $scope.test = function(post, color) {

        console.log(post);
        // overriding post model with color (String)
        if (color === "red") {
          post.color = "red";
        } else if (color === "blue"){
          post.color = "blue";
        } else if (color === "yellow"){
          post.color = "yellow";
        } else {
          post.color = "default";
        }
        
        $http.put('/api/posts/'+ post._id, post)
        .success(function(response){
         // console.log(response);
       });
    };

  

    $scope.createPost = function(user) {
     
        var config = {
            userId: user._id,
            title : $scope.post.title,
            body  : $scope.post.body,
            color:  $scope.post.color,
        };
        console.log(config);
        $http.post('/api/posts', config)
        .success(function(response){
            toastr.success('You have successfully created a task!');
            // console.log('response', response);
             $scope.user.posts.unshift(response);
        })
        .error(function(response){
            console.log('err', response);
        });

    };


    $scope.editPost = function(post){
        $scope.post = {
            userId: post.userId[0],
            _id: post._id,
            title: post.title,
            body: post.body
        };
        // console.log('edit', $scope.post);
    };


    $scope.updatePost = function(post){
      console.log("Color: "+post.color)
       // console.log('update', post)
       $http.put('/api/posts/'+ post._id, post)
       .success(function(response){
         toastr.warning('You have successfully updated a task!');
         // console.log(response)
         post.editForm = false;
       });
       // console.log('edit', post);
     };

  

    $scope.deletePost = function(post) {
      $http.delete('/api/posts/' + post._id)
        .success(function(data) {
          toastr.error('You have successfully deleted a task!');
          var index = $scope.user.posts.indexOf(post);
          $scope.user.posts.splice(index,1);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };


    $scope.postShow = function(post) {
      $location.path('/posts/' + post._id + '/comments');
  
    };


  }])
  .controller('PostShowCtrl', ['$scope', '$http', '$auth', 'Auth', '$location', '$routeParams', 'toastr', 'Post', '$window','$q', function($scope, $http, $auth, Auth, $location, $routeParams, toastr, Post, $window, $q) {
    $http.get('/api/me').success(function(data) {
      $scope.user = data
      // $scope.post = data.post
      // $scope.comment = data.post.comments
    });

    //go back button
      $scope.backButton = function() {
         $window.history.back();
      };

    Post.get({ id: $routeParams.id }, function(post) {
      $scope.post = post;
      $scope.comment = post.comments;
      // console.log('outside', post);
    });

    $scope.test = function(post, color) {

        // console.log(post);
        // overriding post model with color (String)
        if (color === "red") {
          post.color = "red";
        } else if (color === "blue"){
          post.color = "blue";
        } else if (color === "yellow"){
          post.color = "yellow";
        } else {
          post.color = "default";
        }
        
        $http.put('/api/posts/'+ post._id, post)
        .success(function(response){
         // console.log(response);
       });
    };

    $scope.editPost = function(post){
        $scope.post = {
            userId: post.userId[0],
            _id: post._id,
            title: post.title,
            body: post.body
        };
        // console.log('edit', $scope.post);
    };

    $scope.updatePost = function(post){
      console.log("Color: "+post.color)
       // console.log('update', post)
       $http.put('/api/posts/'+ post._id, post)
       .success(function(response){
         toastr.warning('You have successfully updated a task!');
         // console.log(response)
         post.editForm = false;
       });
       // console.log('edit', post);
     };

     $scope.createComment = function(post, user){
       var config = {
         body: $scope.comment.body,
         userId: user._id,
         post: post._id
       };

       console.log('config', config)
       $http.post('/api/post/' + post._id + '/comments', config)
       .success(function(response){
         toastr.success('You have successfully created a comment!');
         // console.log('response is', response)
         $scope.post.comments.unshift(response);
         // console.log('post comment is', post.comments)
       })
       .error(function(response){
         console.log('err', response)
       });
     };

     $scope.deleteComment = function(comment) {
       $http.delete('/api/posts/' + comment.post + '/comments/' + comment._id)
         .success(function(data) {
           toastr.error('You have successfully deleted a comment!');
           var index = $scope.post.comments.indexOf(comment);
           $scope.post.comments.splice(index,1);

         })
         .error(function(data) {
           console.log('Error: ' + data);
         });
     };

     $scope.updateComment = function(comment) {
      $http.put('/api/posts/' + comment.post + '/comments/' + comment._id)
      .success(function(response){
        toastr.warning('You have successfully updated a comment!');
        // console.log(response);
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
         
         $http.put('/api/posts/'+ comment.post + '/comments/' + comment._id, comment)
         .success(function(response){
          // console.log(response);
        });
     };

  }]);


