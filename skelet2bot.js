var botgram = require("botgram");
var bot = botgram(process.argv[2]);
/*var bittrex = require('node.bittrex.api');
bittrex.options({ //this key can only view info so fuck off
	'apikey' : "b5704d05ee1b4e1e83ec5a835e4ff1a5",
	'apisecret' : "4fef149067494c3fa808d1074777af8d",
});*/

var feature = "This feature is either under construction or I'm too retarded to implement it";
var linux = ["When you say Linux, you probably mean the GNU operating system, running Linux as the kernel. You should therefore say GNU/Linux or GNU+Linux.", "I'd just like to interject for moment. What you're refering to as Linux, is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX. Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called Linux, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine's resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called Linux distributions are really distributions of GNU/Linux!", "Please use the term \"GNU/Linux\" or \"GNU+Linux\"."];
var fag = ["When you say Raphy, you probably mean the faggot, running Raphy as the kernel. You should therefore say faggot/Raphy or faggot+Raphy.", "HAHA yeah what a FAG", "Did you mean \"Massive Faggot\"?"];

bot.text(function (msg, reply, next) {
	var text = msg.text.toLowerCase();
	if (text.includes("linux") && !text.includes("gnu"))
		reply.reply(msg).text(linux[Math.floor(Math.random()*linux.length)]);
	if (text.includes("raphy") && !text.includes("faggot"))
		reply.reply(msg).text(fag[Math.floor(Math.random()*fag.length)]);
});

bot.command("start", function (msg, reply, next) {
	reply.text("fuck off");
});

bot.command("price", function (msg, reply, next) {
	reply.text(feature);
});

bot.command("weather", function (msg, reply, next) {
	reply.text(feature);
});
