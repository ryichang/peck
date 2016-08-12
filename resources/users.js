
var User = require('../models/user.js')
  , qs = require('querystring')
  , jwt = require('jwt-simple')
  , request = require('request')
  , config = require('../config.js')
  , moment = require('moment')
  , auth = require('./auth')

module.exports = function(app) {
  
  app.get('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findOne({ _id: req.userId })
        .populate('posts')
        .populate('events')
        .populate('notes')
        .populate('comments')
        .populate('groups')
        .exec(function(err, user) {
          console.log(user);
          res.send(user);
        });
  });

  app.put('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.userId, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

  app.post('/auth/login', function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
      if (!user) {
        return res.status(401).send({ message: 'Wrong email or password' });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        console.log(isMatch);
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong email or password' });
        }
        res.send({ token: auth.createJWT(user) });
      });
    });
  });

  app.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken' });
      }
      
      var user = new User({
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName,
      });

      user.save(function(err) {
        if (err) { return res.status(400).send({err: err}) ;}

        res.send({ token: auth.createJWT(user) });
      });
    });
  });
    
    app.post('/auth/facebook', function(req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.6/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.6/me?fields=' + fields.join(',');
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }
        console.log(profile);
        if (req.headers.authorization) {
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.facebook = profile.id;
              user.picture = user.picture || 'https://graph.facebook.com/v2.6/' + profile.id + '/picture?type=large';
              user.displayName = user.displayName || profile.name;
              
              user.save(function() {
                res.send({ token: auth.createJWT(user) });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              var token = auth.createJWT(existingUser);
              return res.send({ token: token });
            }


            var user = new User();
            user.facebook = profile.id;
            user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            user.displayName = profile.name;
            console.log('USER ISSSSSSSSS', user);
            // var user = new User({
            // email: req.body.email,
            // password: req.body.password
            // });

            user.save(function(err) {
              if(err){
                console.log(err);
              }
              res.send({ token: auth.createJWT(user) });
            });
          });
        }
      });
    });
  });

  app.post('/auth/google', function(req, res) {
     var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
     var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
     var params = {
       code: req.body.code,
       client_id: req.body.clientId,
       client_secret: config.GOOGLE_SECRET,
       redirect_uri: req.body.redirectUri,
       grant_type: 'authorization_code'
     };

     // Step 1. Exchange authorization code for access token.
     request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
       var accessToken = token.access_token;
       var headers = { Authorization: 'Bearer ' + accessToken };

       // Step 2. Retrieve profile information about the current user.
       request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
         if (profile.error) {
           console.log(profile.error);
           return res.status(500).send({message: profile.error.message});
         }
         // Step 3a. Link user accounts.
         if (req.header('Authorization')) {
           User.findOne({ google: profile.sub }, function(err, existingUser) {
             if (existingUser) {
               return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
             }
             var token = req.header('Authorization').split(' ')[1];
             var payload = jwt.decode(token, config.TOKEN_SECRET);
             User.findById(payload.sub, function(err, user) {
               if (!user) {
                 return res.status(400).send({ message: 'User not found' });
               }
               user.google = profile.sub;
               user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
               user.displayName = user.displayName || profile.name;
               user.save(function(err) {
                 if (err){
                   console.log('Step2:', err);
                 }
                 var token = auth.createJWT(user);
                 res.send({ token: token });
               });
             });
           });
         } else {
           // Step 3b. Create a new user account or return an existing one.
           User.findOne({ google: profile.sub }, function(err, existingUser) {
             if (existingUser) {
               return res.send({ token: auth.createJWT(existingUser) });
             }
             var user = new User();
             console.log('Google', user);
             user.google = profile.sub;
             console.log('Google', user.google);
             user.picture = profile.picture.replace('sz=50', 'sz=200');
             user.displayName = profile.name;
             console.log('Google', user.displayName);
             user.save(function(err) {
               if (err){
                 console.log("step 3", err);
               }
               var token = auth.createJWT(user);
               res.send({ token: token });
             });
           });
         }
       });
     });
   });

};