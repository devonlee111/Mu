const play = require('./play.js');
const stop = require('./stop.js');

module.exports = {
    name: "skip",
    async execute(guildInfo, message) {
		play.playNext(guildInfo.audioInfo);
    	message.reply("skipping to next song...");
	}
};

