$(document).ready(function(){
	
// console.log("SANITY CHECK!!!!!!!");
// $(window).scroll(function() {
//   if ($(document).scrollTop() > 50) {
//     $('navbar').addClass('shrink');
//   } else {
//     $('navbar').removeClass('shrink');
//   }
// });

// $(function() {

//             $.ajax({
//                 url: "http://cors.io/?u=https://api.fantasydata.net/nba/v2/JSON/News",
//                 beforeSend: function(xhrObj){
//                     // Request headers
//                     xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","2b9f1a534dd54c359e101c94bc7547aa");
//                 },
//                 type: "GET",
//                 dataType: 'json',
//             })
//             .done(function(data) {
//                 alert("success");
//             })
//             .fail(function() {
//                 alert("error");
//             });
//         });

// var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
// url += '?' + $.param({
//   'api-key': "e4cbd64f281e46f882876736e874cff6",
//   'callback': "homeTopStoriesCallback"
// });
// $.ajax({
//   url: url,
//   method: 'GET',
// }).done(function(result) {
//   console.log(result);
// }).fail(function(err) {
// });

$('.text-1').children('p').each(function(index){
  var blinkInt=setInterval(function(){},1000);
});

// //CALENDAR
	setInterval(function(){
	var hour=new Date().getHours();
		if(hour<10){
			$(".hour").html("0"+hour);
		}
		else if(hour>12){
			hour=hour-12;
			if(hour<10){
				$(".hour").html("0"+hour);
			}
			else{
				$(".hour").html(hour);
			}
		}
		else{
		$(".hour").html(hour);
		}
	},1000);
	setInterval(function(){
		var minutes=new Date().getMinutes();
		if(minutes < 10){
			$(".minutes").html("0"+minutes);
		}
		else{
		$(".minutes").html(minutes);
		}
	});
	setInterval(function(){
		var seconds=new Date().getSeconds();
		if(seconds<10){
			$(".seconds").html("0"+seconds);
		}
		else{
		$(".seconds").html(seconds);
		}
	},1000);
	
	var weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var month=["January","February","March","April","May","June","July","August","September","October","November","December"];
	setInterval(function(){
		var d=new Date();
		var dow=weekday[d.getDay()];
		var mo=month[d.getMonth()];
		var num=d.getDate();
		var date=mo+" "+num
		var yr=d.getFullYear();
		$(".day").html(dow);
		$(".month").html(date);
		$(".year").html(yr);
	},1000);



// $('[data-toggle=offcanvas]').click(function() {
//   	$(this).toggleClass('visible-xs text-center');
//     $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
//     $('.row-offcanvas').toggleClass('active');
//     $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
//     $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
//     $('#btnShow').toggle();
// });


});


