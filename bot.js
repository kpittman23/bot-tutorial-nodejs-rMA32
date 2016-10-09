var HTTPS = require('https');

var botID = process.env.BOT_ID;

var races = ["Human", "Android", "Glorgok", "Ikatrians", "Zolts"];
var race = races[0];
var chosenClasses = ["Warrior", "Rogue", "Range", "Berzerker", "Xenomancer"];
var chosenClass = chosenClasses[0];
var attack = 20;
var defense = 30;
var evasiveness = 55;
var accuracy = 51;
var hp = 99;
var speed = 61;
var checkpoint = 1;


function respond() {
	var request = JSON.parse(this.req.chunks[0]),
	botRegexKya = /(.|)*(k|K)ya!~/;
	botname = /(.|)*kyaa!~/;
	botsave = /(.|)*\bsave\b/;

	var waifuPhrases = [ "https://pbs.twimg.com/media/B8YdqjxIQAAU87L.jpg", "It's not like I l-like you or anything...", 
		"B-B-baka!", "My senpai is the best!", "But isn't that... lewd?", "Kemy-kun is sugoi, but not as sugoi as senpai!", "Noooo!",
		"http://i0.kym-cdn.com/photos/images/facebook/000/240/558/d76.jpg", "http://2.bp.blogspot.com/-6hX2FngcmZk/U1VlHs5CfNI/AAAAAAAAQNI/yxSWLiV-z94/s1600/waifu.png"]

	if(request.text && botRegexKya.test(request.text)) {
		this.res.writeHead(200);
		postMessage(waifuPhrases[getRandomInt(0,waifuPhrases.length)]);
		this.res.end();
	}
	else if(request.text && botname.test(request.text)) {
		this.res.writeHead(200);
		postMessage("test");
		this.res.end();
	}
	else if(request.text && botsave.test(request.text)) {
		saveProgress();
		this.res.end();
	}
	else {
		console.log("Nothing happened");
		this.res.writeHead(200);
		this.res.end();
	}
}

function saveProgress(){
	var saveCode = 123456789012343;
	var encodedSaveCode = encode(saveCode);
	postMessage("the original code was " + saveCode.toString() + " and the encoded one is " + encodedSaveCode.toString());
}

function encode(saveCode){
	var digitArray = [];
	for(i = 0; i < 15; i++){
		digitArray[i] = saveCode % 10;
		saveCode = saveCode - digitArray[i];
		saveCode = saveCode / 10;
	}

	var sum = 0;
	for (i = 0; i < 15; i++){
		sum = sum + digitArray[i] * Math.pow(10,i);
	}
	return sum;

}

/*function decode(saveCode){
	var digitArray = [];
	for(i = 0; i < 15; i++){
		digitArray[i] = saveCode % 10;
		saveCode = saveCode - digitArray[i];
		saveCode = saveCode / 10;
	}
	race = races[digitArray[0]];
	chosenClass = chosenClasses[digitArray[1]];
	attack = digitArray[2] + digitArray[3] * 10;
	defense = digitArray[4] + digitArray[5] * 10;
	evasiveness = digitArray[6] + digitArray[7] * 10;
	accuracy = digitArray[8] + digitArray[9] * 10;
	hp = digitArray[10] + digitArray[11] * 10;
	speed = digitArray[12] + digitArray[13] * 10;
	checkpoint = digitArray[13];
}*/

function postMessage(response) {
	var botResponse,options, body, botReq;

	botResponse = response

	options = {
			hostname: 'api.groupme.com',
			path: '/v3/bots/post',
			method: 'POST'
	};

	body = {
			"bot_id" : botID,
			"text" : botResponse
	};

	console.log('sending ' + botResponse + ' to ' + botID);

	botReq = HTTPS.request(options, function(res) {
		if(res.statusCode == 202) {
			//neat
		} else {
			console.log('rejecting bad status code ' + res.statusCode);
		}
	});

	botReq.on('error', function(err) {
		console.log('error posting message '  + JSON.stringify(err));
	});
	botReq.on('timeout', function(err) {
		console.log('timeout posting message '  + JSON.stringify(err));
	});
	botReq.end(JSON.stringify(body));
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}


exports.respond = respond;

