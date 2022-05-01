const { getVoiceConnection } = require('@discordjs/voice');
const { youtubeAPI } = require('../config.json');

module.exports = {
    name: "pause",
    async execute(guildInfo, message) {
		if (guildInfo.subscription == null) {
			message.reply("Not currently playing audio.");
			return
		}

		let player = guildInfo.audioInfo.subscription.player;

		player.pause();
    },
};

