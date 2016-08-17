var Event = require('../models/event.js'),
	User = require('../models/user.js'),
	Group = require('../models/group.js'),
	Comment = require('../models/comment.js'),
    auth = require('./auth');

module.exports = function(app) {

	
	// get all events
	app.get('/api/events', auth.ensureAuthenticated, function(req, res) {
		console.log("HIT API")
		User.findById(req.userId).exec(function(err, user) {
			// use mongoose to get all posts in the database
			User.find(function(err, events) {

				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					res.send(err);

				res.json(events); // return all posts in JSON format
			});
		});
	});

	// app.get('/api/events/:event_id', auth.ensureAuthenticated, function (req,res) {
	//         User.findById(req.userId).exec(function (err, user) {
	//             Event.findById({ _id: req.params.event_id}, function(err, event) {
	//                 if (err) { return res.status(404).send(err); }
	//                 res.send(event); 
	//                 console.log('event is', event);
	//             });
	//         });
	//     });

	app.get('/api/events/:event_id', auth.ensureAuthenticated, function (req,res) {
	        User.findById(req.userId).exec(function (err, user) {
	            Event.findById(req.params.event_id)
	            	.populate({
	            		path: 'comments', 
	            		populate: {
	            			path:'userId', 
	            			model: 'User'
	            		}
	            	}) 
	            	.populate('userId')
	            	    .exec(function(err, event) {
	            	        if (err) { return res.status(404).send(err); }
	            	        res.send(event);
	 
	            	    });
	            	});

	});

	app.put('/api/events/:event_id', auth.ensureAuthenticated, function(req,res){ 
	    console.log('putroute', req.body);
	    console.log('eventId', req.params.event_id);
	        Event.findOneAndUpdate({ _id: req.params.event_id}, req.body , function (err, event) {
	            // console.log("editRoute", event);
	            if (err) { return res.send(err); }
	            // console.log('backend', event);
	            
	            res.send(event);
	        });
	});

	app.post('/api/events', auth.ensureAuthenticated, function (req,res) {
		User.findById(req.userId).exec(function(err, user) {
			var event = new Event(req.body);
			event.save(function(err, event) {
				user.events.unshift(event._id);
				user.save();
				res.send(event);				
			});
		});
	});

	

	// app.delete('/api/events/:event_id', function(req, res) {
	// 	Event.findByIdAndRemove({
	// 		_id : req.params.event_id
	// 	 }, function(err, event) {
	// 		if (err)
	// 			res.send(err);

	// 		// find User and pull event from events array in User
	// 		User.findOneAndUpdate(
	// 			{ events: req.params.event_id},
	// 			{ "$pull": {"events": req.params.event_id}},
	// 			function (err, event){
	// 				if(err) {
	// 					res.send(err);
	// 				} else {
	// 					console.log("OBjectID", event);

	// 					// get and return all the events after you create another
	// 					res.status(200).send('Find user and deleted');
	// 				}
					
	// 			});
	// 		});
	// });

	app.delete('/api/events/:event_id', function(req, res) {
		Event.findByIdAndRemove({
			_id : req.params.event_id
		 }, function(err, event) {
			if (err)
				res.send(err);

			// Delete Event in User
			User.findOneAndUpdate(
				{ events: req.params.event_id},
				{ "$pull": {"events": req.params.event_id}},
				
				function (err, event){
					if(err) {
						res.send(err);
					} else {
						console.log("OBjectID", event);
						Comment.remove({ event: req.params.event_id},
							function(err, comment){
								if(err){
									console.log(err);
									return res.send(err);
								}
							console.log('comment delete', comment);
							});
						res.status(200).send('Find user and deleted');
					}
					
				});
			});
	});

	app.post('/api/group/:group_id/events', auth.ensureAuthenticated, function (req, res){
			console.log("comment passed back", req.body);
			Group.findById(req.body.groupId).exec(function(err,group){
				var event = new Event(req.body);
				event.save(function(err, event){
					group.events.unshift(event._id);
					group.save();
					Event.findById(event._id)
					.populate('userId')
					.exec(function (err, event){
						res.send(event);
					});
				});
			});

		});


	app.put('/api/groups/:group_id/events/:event_id', auth.ensureAuthenticated, function(req,res){ 
	    console.log('putroute', req.body);
	    console.log('eventId', req.params.event_id);
	    console.log('groupID', req.params.group_id);
	    	Group.findById(req.body.group_id).exec(function(err,group){
				Event.findOneAndUpdate({ _id: req.params.event_id}, req.body , function (err, event) {
	            if (err) { return res.send(err); }
	            // console.log('backend', note);
	            res.send(event);
	            });
			});
	     });

	app.delete('/api/groups/:group_id/events/:event_id', auth.ensureAuthenticated, function(req,res){
		console.log('res is' , res)
		Event.remove({ _id: req.params.event_id}, function (err, event){
            if(err){
                console.log(err);
                return res.send(err);
            }

            Group.findOneAndUpdate(
                { "_id": req.params.group_id},
                { "$pull": {"events": req.params.event_id}},
                function (err, group){
                    if (err) {
                    	console.log("err is", err)
                    	return res.send(err);}
                    else {
                        console.log("Object Group Delete", group) ;
                        res.status(200).send('Finished Delete');
                    }
                });
        });

	});

};
