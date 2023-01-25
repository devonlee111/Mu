const { getVoiceConnection } = require('@discordjs/voice');
const { youtubeAPI } = require('../config.json');

module.exports = {
    name: "autoplay",
    async execute(message, player) {
		guildInfo.audioInfo.autoplay = !guildInfo.audioInfo.autoplay;
		if (guildInfo.audioInfo.autoplay) {
			message.reply("Will now autoplay after queue is exhausted");
		}
		else {
			message.reply("will no longer autoplay");
		}
		
		return;
    },
};

