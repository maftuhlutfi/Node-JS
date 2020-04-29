var bleep = new Audio("/sound/bleep.mp3");
var blinktext = "";

$(".clock").on("change", function() {
	bleep.play();
	blinktext = "Start";
})



var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var i = 0;

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	h = checkTime(h);
	m = checkTime(m);
	s = checkTime(s);

	if (h == 0 && m === 0 && s === 0) {
		autoRefresh();
	}

	var date = today.getDate();
	var day = days[today.getDay()];
	var month = months[today.getMonth()];
	var year = today.getFullYear();

	$(".day").text(day);
	$(".month").text(month + " " + date);
	$(".year").text(year);

	$('.clock h1').text(h + " : " + m + " : " + s);
	var t = setTimeout(startTime, 1000);

	// Check praytime
	var pray = false;
	
	prayTime.forEach(function (time, index) {
		if (time.substring(0,2) == h && time.substring(3) == m && s < 10) {
			pray = true;
			blinktext = prayName[index];
			$("." + blinktext.toLowerCase() + " img").attr("src", "/images/active-frame.png");
			bleep.play();
			$(".clock h1").text(blinktext);
			$("div.clock").addClass("blinking");
		} else {
		if ($("div.clock").hasClass("bleep")) {
			$("div.clock").removeClass("blinking");
			$("div.clock").removeClass("bleep");
			i = 0;
			$("." + blinktext.toLowerCase() + " img").attr("src", "/images/frame.png");
			/*clearTimeout(t);
			iqamah();*/
		}
	}
	})
	
	console.log(i);
	
	if (i < 10) {
		bleep.play();
		$(".clock h1").text(blinktext);
		$("div.clock").addClass("blinking");
		i++;
	} else {
		$("div.clock").removeClass("blinking");
	}

	/*if (pray) {
		bleep.play();
		$(".clock h1").text(blinktext);
		$("div.clock").addClass("blinking");
		$("div.clock").addClass("bleep");
	}
	else {
		if ($("div.clock").hasClass("bleep")) {
			$("div.clock").removeClass("blinking");
			$("div.clock").removeClass("bleep");
			i = 0;
			$("." + blinktext.toLowerCase() + " img").attr("src", "/images/frame.png");
			/*clearTimeout(t);
			iqamah();
		}
	}*/
	
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

/*function iqamah() {
	$('.clock h1').text("10 : 00");
	startTimer();
}*/


/*function startTimer() {
  var presentTime = $('.clock h1').text();
  var timeArray = presentTime.trim().split(" : ");
  var m = timeArray[0];
  var s = checkSecond((timeArray[1] - 1));
  if(s == 59){
  	m = m - 1;
  	if (m >= 0) {
  		m = "0" + m;
  	}
  }
  
  console.log(s);
  $('.clock h1').text(m + " : " + s);
  var t = setTimeout(startTimer, 1000);
  if (m < 0) {
  	clearTimeout(t);
  	i = 0;
  	$("." + blinktext.toLowerCase() + " img").attr("src", "/images/frame.png");
  	blinktext = "Iqamah";
  	startTime();
  }
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}*/

function autoRefresh(t) {
   setTimeout("location.reload(true);", t);
}


var prayTime = [];
var prayName = ["Fajar", "Zohar", "Asr", "Maghrib", "Esha"];
prayTime[0] = $('.fajar h1').text();
var date = new Date();
if (date.getDay() == 5) {
	prayTime[1] = $('.jummah h1').text();
	prayName[1] = "Jummah";
} else {
	prayTime[1] = $('.zohar h1').text();
}

prayTime[2] = $('.asr h1').text();
prayTime[3] = $('.maghrib h1').text();
prayTime[4] = $('.esha h1').text();
