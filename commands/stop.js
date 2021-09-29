const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing and empty queue'),
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
        const connection = getVoiceConnection(guild)
        if (connection == null) {
            return interaction.reply('Not connected to a voice channel');
        }

        let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
        let player = audioPlayer.guildQueues[guildIndex].player;
        if (player != null) {
            player.stop();
        }

        audioPlayer.guildQueues[guildIndex].queue = [ '' ];

        return interaction.reply("Stopping...");
    },
};

