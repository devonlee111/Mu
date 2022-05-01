const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'disconnect',
    async execute(guildInfo, message) {
		let audioInfo = guildInfo.audioInfo;
        let connection = getVoiceConnection(message.guildId)
        if (connection == null) {
			message.reply("not currently connected");
        }

        audioInfo.reset();
		connection.destroy();
    },
};

