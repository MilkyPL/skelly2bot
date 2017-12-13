"use strict";

const Telegraf = require("telegraf");
const { Telegram } = require("telegraf");
const { json } = require("req");
const cowsay = require("cowsay");
const key = process.argv[2];
const readline = require("readline");
const Danbooru = require("danbooru");

const args = text => text.split(" ").slice(1);
const argstring = text => args(text).join(" ").trim();

const bot = new Telegraf(key);
bot.telegram.getMe().then(data =>
	bot.options.username = data.username);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "chat: "
});

const tg = new Telegram(key);

const booru = new Danbooru();

const feature = ({ reply }) =>
	reply("This feature is either under construction " +
	"or I'm too retarded to implement it");

const cow = `<pre>
         (__)
         (oo)
   /------\\/
  / |    ||
 *  /\\---/\\
    ~~   ~~
...."Have you mooed today?"...</pre>`;

const cows = ["beavis.zen", "bong", "bud-frogs", "bunny", "cheese", "cower", "daemon", "default", "doge", "dragon-and-cow", "dragon", "elephant-in-snake", "elephant", "eyes", "flaming-sheep", "ghostbusters", "goat", "head-in", "hedgehog", "hellokitty", "kiss", "kitty", "koala", "kosh", "luke-koala", "mech-and-cow", "meow", "milk", "moofasa", "moose", "mutilated", "ren", "satanic", "sheep", "skeleton", "small", "sodomized", "squirrel", "stegosaurus", "stimpy", "supermilker", "surgery", "telebears", "turkey", "turtle", "tux", "vader-koala", "vader", "whale", "www"];

bot.command("start", ({ reply }) =>
	reply("fuck off"));

bot.command("moo", ({ reply }) =>
	reply(cow, { parse_mode: "HTML" }));

bot.command("test", feature);

bot.command("rogue", feature);

bot.command("info", feature);

bot.command("danbooru", ({ message, reply, replyWithPhoto }) => {
	const tags = args(message.text);
	let errors = "Following errors occured:\n";
	if(tags == "")
		reply("you forgot to specify tags retard");
	else booru.posts(tags)
		.then(posts => posts[Math.floor(Math.random()*posts.length)])
		.then(post => booru.posts.get(post))
		.catch(function(e) {
			errors += e + "\n";
		})
		.then(postInfo => {
			const file = postInfo.file;
			const caption = `Post ID: ${postInfo.id}\n` + 
			`Artist: ${postInfo.tags.artist}\n` +
			`Characters: ${postInfo.tags.character}\n` +
			`Copyright info: ${postInfo.tags.copyright}`;
			if(!("request" in file))
				reply("image unavailable\n" + caption);
			else replyWithPhoto(`https://danbooru.donmai.us/data/${file.name}`, { caption })
				.catch(function(e) {
					if(e.toString().includes("400"))
						replyWithPhoto(`https://danbooru.donmai.us/cached/data/${file.name}`, { caption });
					else {
						errors += e + " (image unavailable)\n";
						reply(errors);
					}
				});
		})
		.catch(function(e) {
			errors += e + "\n";
			reply(errors + "You propably used nonexisting tags.");
		});
});

bot.command("price", ({ message, reply }) => {
	if(args(message.text)[0] == undefined)
		reply("input a valid ticker symbol retard");
	else json("https://api.coinmarketcap.com/v1/ticker/?limit=0")
		.then(crap => crap.find(obj =>
			obj.symbol === args(message.text)[0].toUpperCase()))
		.then(balls => {
			if(balls == undefined)
				reply("input a valid ticker symbol retard");
			else balls.percent_change_24h.includes("-") //as long as it works
				? reply(balls.name + ": " + balls.price_usd + "$ " + balls.percent_change_24h + "% 📉")
				: reply(balls.name + ": " + balls.price_usd + "$ +" + balls.percent_change_24h + "% 📈");
		});
});

bot.command("weather", ({ message, reply }) => {
	const K = 273.15;
	const icons = {
		"01d": "☀", "01n": "🌕",
		"02d": "🌤", "02n": "🌤",
		"03d": "⛅", "03n": "⛅",
		"04d": "☁", "04n": "☁",
		"09d": "🌧", "09n": "🌧",
		"10d": "🌦", "10n": "🌦",
		"11d": "🌩", "11n": "🌩",
		"13d": "🌨", "13n": "🌨",
		"50d": "🌫", "50n": "🌫"
	};
	return json("http://api.openweathermap.org/data/2.5/weather?q=" +
		encodeURIComponent(argstring(message.text)) +
		"&APPID=1566ed87c9944f0df94332da29ee817c").then(data =>
		data.cod !== 200
			? reply(`Error:\n${data.cod}: ${data.message}`)
			: reply(
				"Weather in " +
				data.name + ", " + 
				data.sys.country + ": " +
				Math.floor(data.main.temp - K) + "°C, " +
				data.weather[0].description + " " +
				(icons[data.weather[0].icon] || "") + "\n" +
				" Humidity: " + Math.floor(data.main.humidity) + "%\n" +
				" Air pressure: " + Math.floor(data.main.pressure) + " hPa"));
});

bot.command("skelet", ({ reply }) => {
	let skelets = "";
	for (let i = 0; i < Math.floor((Math.random() * 20) + 1 ); i++)
		skelets += Math.random() < 0.5 ? "💀" : "☠";
	return reply(skelets);
});

bot.command("cowsay", ({ message, reply }) => {
	const arg = args(message.text);
	let text = arg.slice();
	let notCow = false;
	text.splice(0,1);
	if(arg == undefined || message.text == undefined || arg[0] == undefined) {
		reply("specify animal and/or text");
	} else for(let i = 0; i < cows.length; i++){
		if(arg[0].includes(cows[i])) {
			reply("```" + cowsay.say({
				text : text.join(" ") || "I'm too dumb to type some text",
				f : arg[0]
			}) + "```", { parse_mode: "Markdown" });
			notCow = true;
			break;
		} else continue;
	} if(arg[0].includes("list") && notCow === false) {
		reply(cows);
	} else if(notCow === false) {
		reply("```" + cowsay.say({
			text : arg.join(" ") || "Have you mooed today?",
		}) + "```", { parse_mode: "Markdown" });
	}
});
/* //To be moved to plugins/bridge.js
bot.on("text", ({ message, replyWithSticker, reply, tg }) => {
	let msg = message.chat.title + "\n" + message.from.username + ": " + message.text;
	if (message.from.username == undefined)
		msg = message.chat.title + "\n" + message.from.first_name + " " + message.from.last_name + ": " + message.text;
	if(message.chat.id == "-1001144567507") {
		tg.sendMessage("-1001064029829", msg);
	} else tg.sendMessage("-1001144567507", msg);
	const text = message.text.toLowerCase();
	if(message.from.id == 353196474 && text.includes("nice") || message.from.id == 128432371 && text.includes("nice"))
		replyWithSticker("CAADBAADPwADulkNFYeAzy5ClSxjAg");
	else if(text == undefined)
		reply("unknown error");
});

bot.on("photo", ({ message, tg }) => {
	let caption = message.chat.title + "\n" + message.from.username + ": " + message.caption;
	if (message.from.username == undefined)
		caption = message.chat.title + "\n" + message.from.first_name + " " + message.from.last_name + ": " + message.caption;
	if(message.chat.id == "-1001144567507"){
		tg.sendPhoto("-1001064029829", message.photo[0].file_id, { caption });
	} else {
		tg.sendPhoto("-1001144567507", message.photo[0].file_id, { caption });
	}
});

bot.on("video", ({ message, tg }) => {
	let caption = message.chat.title + "\n" + message.from.username + ": " + message.caption;
	if (message.from.username == undefined)
		caption = message.chat.title + "\n" + message.from.first_name + " " + message.from.last_name + ": " + message.caption;
	if(message.chat.id == "-1001144567507"){
		tg.sendVideo("-1001064029829", message.video.file_id, { caption });
	} else {
		tg.sendVideo("-1001144567507", message.video.file_id, { caption });
	}
});
let id = "-1001144567507";
rl.prompt();
rl.on("line", (line) => {
	switch (line.trim()) {
	case "/setchat":
		rl.question("set chat id: ", (setid) => {
			id = setid;
			rl.prompt();
		});
		break;
	default:
		tg.sendMessage(id, `${line.trim()}`);
		break;
	}
	rl.prompt();
});

bot.startPolling();
