"use strict";

const Telegraf = require("telegraf");
const { Telegram } = require("telegraf");
const { json } = require("req");
const cowsay = require("cowsay");
// const cron = require("node-cron");
const key = process.argv[2];
const readline = require("readline");
const Danbooru = require("danbooru");
const fs = require("fs");

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

bot.command("danbooru", ({ message, reply, replyWithPhoto }) => {
	const tags = args(message.text);
	if(tags == "")
		reply("you forgot to specify tags retard");
	else booru.posts(tags)
		.then(posts => posts[Math.floor(Math.random()*posts.length)])
		.then(post => booru.posts.get(post))
		.then(postInfo => {
			const file = postInfo.file;
			if(!("request" in file))
				reply("image unavailable");
			file.download()
				.then(dataBuffer => {
					fs.writeFileSync(`./img/${file.name}`, dataBuffer);
					replyWithPhoto(`file://./img/${file.name}`); // have to create a form to upload the image
					fs.unlinkSync(`./img/${file.name}`);
				});
		});
});

bot.command("price", ({ message, reply }) => {
	json("https://api.coinmarketcap.com/v1/ticker/")
		.then(crap => crap.find(obj =>
			obj.symbol === args(message.text)[0].toUpperCase()))
		.then(balls => balls.percent_change_24h.includes("-") //as long as it works
			? reply(balls.name + ": " + balls.price_usd + "$ " + balls.percent_change_24h + "% 📉")
			: reply(balls.name + ": " + balls.price_usd + "$ +" + balls.percent_change_24h + "% 📈"));
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
	text.splice(0,1);
	const cowlist = cows.join(" ");
	if(arg == undefined || message.text == undefined || arg[0] == undefined) {
		reply("specify animal and/or text");
	} else if(cowlist.includes(arg[0])) {
		reply("```" + cowsay.say({
			text : text.join(" ") || "I'm too dumb to type some text",
			f : arg[0]
		}) + "```", { parse_mode: "Markdown" });
	} else if(arg[0].includes("list")) {
		reply(cowlist);
	} else {
		reply("```" + cowsay.say({
			text : arg.join(" ") || "Have you mooed today?",
		}) + "```", { parse_mode: "Markdown" });
	}
});

bot.on("text", ({ message, replyWithSticker, reply, tg }) => {
	let msg = message.from.username + ": " + message.text;
	if (message.from.username == undefined)
		msg = message.from.first_name + " " + message.from.last_name + ": " + message.text;
	if(message.chat.id != "-1001064029829" && message.chat.id != "-1001138989974" && message.chat.id != "-1001144567507")
		tg.sendMessage("@skeletlog", msg);
	const text = message.text.toLowerCase();
	if(message.from.id == 353196474 && text.includes("nice") || message.from.id == 128432371 && text.includes("nice"))
		replyWithSticker("CAADBAADPwADulkNFYeAzy5ClSxjAg");
	else if(text == undefined)
		reply("unknown error");
});

bot.on("photo", ({ message, tg }) => {
	let caption = message.from.username + ": " + message.caption;
	if (message.from.username == undefined)
		caption = message.from.first_name + " " + message.from.last_name + ": " + message.caption;
	if(message.chat.id != "-1001064029829" && message.chat.id != "-1001138989974" && message.chat.id != "-1001144567507")
		tg.sendPhoto("@skeletlog", "AgADBAADfaoxG7iKsVPYCaI5l5clN2k5IBoABAKuheQGY-H5tjIAAgI", caption);
});

let id = "@skeletlog";
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
