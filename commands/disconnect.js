const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect from voice channel'),
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
        connection.destroy();

        if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
            let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            audioPlayer.guildQueues.splice(guildIndex, 1);
        }

        console.log(audioPlayer.guildQueues);

        return interaction.reply("Disconnecting...");
    },
};

