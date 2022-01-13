const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Empty the queue'),
    async execute(interaction, message) {
        if (interaction == null) {
            if (message == null) {
                // should not happen
                console.log('no interaction or message provided');
                return
            }
            interaction = message;
        }

        var guild = interaction.guildId;
        let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
	    if (guildIndex == -1) {
			return 'There is no queue to clear.';
		}
		else {
			audioPlayer.guildQueues[guildIndex].queue = [ '' ];
		}
        return 'Queue cleared...';
    },
};

