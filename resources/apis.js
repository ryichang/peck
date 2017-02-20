var auth = require('./auth')
		,config = require('../config.js')
		,request = require('request')

module.exports = function(app) {

	app.post('/api/sportsnews', function(req,res){
		console.log('API CALL')
		var api_key = config.NWT_SECRET;
		var url ='https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=6c28641ec7424a5fa0ca019acd34ba24' + '&responce-format=.json&callback=JSON_CALLBACK';
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
