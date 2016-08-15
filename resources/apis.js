var auth = require('./auth')
		,config = require('../config.js')
		,request = require('request')

module.exports = function(app) {

	app.post('/api/sportsnews', function(req,res){
		console.log('API CALL')
		var url ="https://api.nytimes.com/svc/news/v3/content/content.jsonp?api-key=ccb58d5412a54799e82ad086c0387669:5:74719242";
		// res.status(200).send("api works");

		request(url, function(error, response){
			if (error) {
				console.log("error is", error);
			} 
				console.log('data is', response);
				res.send(response.body);
		});

	});

} ;


