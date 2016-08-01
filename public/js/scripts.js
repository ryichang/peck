$(document).ready(function(){


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



});


