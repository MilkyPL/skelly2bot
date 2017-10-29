"use strict";

const Telegraf = require("telegraf");
const { json } = require("req");
const cowsay = require("cowsay");
const cron = require("node-cron");
const key = process.argv[2];
// const Danbooru = require("danbooru");

const args = text => text.split(" ").slice(1);
const argstring = text => args(text).join(" ").trim();

const bot = new Telegraf(key);
bot.telegram.getMe().then(data =>
	bot.options.username = data.username);

// const booru = new Danbooru();

const feature = ({ reply }) =>
	reply("This feature is either under construction " +
	"or I'm too retarded to implement it");

const inba = ({ replyWithVideo }) =>								// TODO: random replies, automatic cronjob start
	cron.schedule("*/10 37 21 * * *", function() {
		replyWithVideo("https://vignette4.wikia.nocookie.net" +
		"/nonsensopedia/images/c/cf/Patron.gif/revision/latest" +
		"?cb=20130929184445");
	});

const cow = `<pre>
         (__)
         (oo)
   /------\\/
  / |    ||
 *  /\\---/\\
    ~~   ~~
...."Have you mooed today?"...</pre>`;

bot.command("start", ({ reply }) =>
	reply("fuck off"));

bot.command("moo", ({ reply }) =>
	reply(cow, { parse_mode: "HTML" }));

bot.command("test", feature);

bot.command("rogue", feature);

bot.command("forecast", feature);

bot.command("danbooru", feature);

bot.command("inba", ({ message, reply, replyWithVideo }) => {
	if(message.from.id == 353196474) {
		reply("inba protocol initiated");
		inba({ replyWithVideo });
	}
	else reply("not authorized");
});											// TODO: switch cronjob on and off


bot.command("price", ({ message, reply }) => {
	if(args(message.text) == undefined)
		reply("give me a valid symbol retard");
	else json("https://api.coinmarketcap.com/v1/ticker/")
		.then(crap => crap.find(obj =>
			obj.symbol === args(message.text)[0].toUpperCase()))
		.then(balls => balls.percent_change_24h.includes("-") //as long as it works
			? reply(balls.name + ": " + balls.price_usd + "$ " + balls.percent_change_24h + " 📉")
			: reply(balls.name + ": " + balls.price_usd + "$ " + balls.percent_change_24h + " 📈"));
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

bot.command("cowsay", ({ message, reply }) =>
	reply("```" + cowsay.say({
		text : argstring(message.text) || "Have you mooed today?"
	}) + "```", { parse_mode: "Markdown" }));

bot.command("papiez", ({ replyWithVideo }) =>
	replyWithVideo("https://vignette4.wikia.nocookie.net" +
		"/nonsensopedia/images/c/cf/Patron.gif/revision/latest" +
		"?cb=20130929184445"));

bot.on("text", ({ message, replyWithSticker, reply }) => {
	const text = message.text.toLowerCase();
	if(message.from.id == 353196474 && text.includes("nice") || message.from.id == 128432371 && text.includes("nice"))
		replyWithSticker("CAADBAADPwADulkNFYeAzy5ClSxjAg");
	else if(text == undefined)
		reply("unknown error");
});

bot.startPolling();
