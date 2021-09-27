const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect from voice channel'),
    async execute(interactioni, message) {
        if (interaction == null) {
            if (message == null) {
                // should not happen
                console.log('no interaction or message provided');
                return
            }
            interaction = message;
        }

        var guildId = interaction.guildId;
        const connection = getVoiceConnection(guildId)
        if (connection == null) {
            return interaction.reply('Not connected to a voice channel');
        }
        connection.destroy();
        return interaction.reply("Disconnecting...");
    },
};

