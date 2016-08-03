'use strict';

/* API Controllers */

angular.module('peckbox')
  .controller('ApisCtrl', ['$scope', '$http', '$auth', 'Auth', 'toastr', '$interval',  function($scope, $http, $auth, Auth, toastr, $interval) {
    $http.get('/api/me').success(function(data) {
      $scope.user = data;
    });

  $scope.news={}
  $scope.types = ['hot'];         
  $scope.subredit="worldnews";      
  $scope.type="top";
  var url="https://api.reddit.com/r/"+$scope.subredit+"/?jsonp=JSON_CALLBACK";
  $http.jsonp(url).success(function(data) {
    $scope.elements = [];
    var dataset = data.data.children;
    for (var i=0; i<dataset.length; i++ ){
          $scope.elements.push(dataset[i].data); // response data 
          // console.log('reddit', $scope.elements);
        }    
    toastr.warning('Loading Top Worldnews from Reddit');   
      });

var api = 'https://api.nytimes.com/svc/news/v3/content/all/all.jsonp?api-key=ccb58d5412a54799e82ad086c0387669:5:74719242&responce-format=.jsonp&callback=JSON_CALLBACK'; 
                $http.jsonp(api).success(function(data){
                    // console.log('response', data)
                    $scope.news = data.results;
                    toastr.warning('Loading latest published articles from New York Times');  
                    // console.log('news scope is', $scope.news)
                });

  $scope.sports={}
  var sport="https://fantasydata.com/rss/rotoworld/?format=jsonp&callback=JSONP_CALLBACK";
  $http.jsonp(sport).success(function(data){
    console.log('sport data is', data);
    { $scope.data = data;};
    console.log('scope fantasy object is', $scope.data)
  })
  .error(function(err){
    console.log('err is', err);
  })


//WEATHER
navigator.geolocation.getCurrentPosition(success, error);
function success(position) {  
  var coords = position.coords;
  $scope.$apply(function(){
        $scope.position = position;
        // console.log('position is', position);
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;    
        var query = lat + "," + lon;
        var url = "https://api.wunderground.com/api/df7130ecdd31c499/geolookup/q/";
     
        $http.jsonp(url + query + ".json" +"?callback=JSON_CALLBACK").success(function(response){
          $scope.location = response;
          // console.log('ApiCtrl', $scope.location)
        });
      });
  $scope.$apply(function(){
    $scope.position = position;
    // console.log('position is', position);
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;    
    var query = "lat=" + lat + "&lon=" + lon;
    var url ="https://api.forecast.io/forecast/";
    var key = "598aeaa830f0e56213a7a3401ab14bf1/";
    $http.jsonp(url + key + lat + "," + lon + "?callback=JSON_CALLBACK").success(function(response){
      $scope.weather = response;
      $scope.CurrentWeather = {
            forecast: {
                iconSize: 20,
                color: "white",
            }
      };
      toastr.info('Current weather is '+ response.currently.summary + ' ' + 'at '+ response.currently.temperature + "°F." + ' ' + response.daily.summary); 
      // console.log('ApiCtrl', $scope.weather)
    });
  });
  // console.log('Your current position is ' + coords.latitude + ' X ' + coords.longitude);
}

function error(err) {  
  console.warn('ERROR(' + err.code + '): ' + err.message);
}


  // Clock
var clock=document.getElementsByTagName('time')[0];
var hLabels=['twelve','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
var mLabels=['','five','ten','quarter','twenty','twenty-five','half'];
function itsaclock(){
    var d = new Date(), h = d.getHours(), m=d.getMinutes();
    var hour = ' '+(m>32 ? hLabels[(h%12) + 1] : hLabels[h%12]) + (m%58<3? ' o\'clock':'');
    var min  = m===0?'':' '+(m<33 ? mLabels[Math.round(m/5)] : mLabels[6-Math.round((m-30)/5)]);
    var approx = m%5===0?'':m%5>2?' nearly':' just after' ; 
    var topast = m%58<3 ? '' : m%60>32? ' to':' past';
    clock.innerHTML= 'It\'s' + approx + min + topast + hour;
    // clock.innerHTML='&#10077'+'It\'s' + approx + min + topast + hour +'&#10078';
    setTimeout(itsaclock, 1000);
}
setTimeout(itsaclock, 2000);


}]);



