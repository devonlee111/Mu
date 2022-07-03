const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: "stop",
    async execute(guildInfo, message) {
		if (guildInfo.audioInfo.subscription == null) {
			message.reply("Not currently playing audio.");
			return;
		}

		let player = guildInfo.audioInfo.subscription.player;

		player.stop();
    },
};

