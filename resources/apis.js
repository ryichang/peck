var auth = require('./auth'),
		config = require('../config.js'),
		request = require('request')

module.exports = function(app) {
	app.post('/api/news', function(req,res){
		console.log('API CALL')
		var url ="http://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=ccb58d5412a54799e82ad086c0387669:5:74719242";
		request(url, function(err, response){
			if (error) {
				console.log("error is", err);
			} 
				console.log('data is', response);
				res.send(response);
		});
	});
} ;

http://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=ccb58d5412a54799e82ad086c0387669:5:74719242
// var api = 'https://api.nytimes.com/svc/news/v3/content/all/all.jsonp?api-key=ccb58d5412a54799e82ad086c0387669:5:74719242&responce-format=.jsonp&callback=JSON_CALLBACK'; 
//                 $http.jsonp(api).success(function(data){
//                     // console.log('news data is', data)
//                     $scope.news = data.results;
//                     toastr.warning('Loading latest published articles from New York Times');  
//                     console.log('news scope is', $scope.news)
//                 });
