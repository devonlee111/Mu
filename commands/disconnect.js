const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect from voice channel'),
    async execute(interaction) {
        var guild = interaction.guildId;
        const connection = getVoiceConnection(guild)
        if (connection == null) {
            return interaction.reply('Not connected to a voice channel');
        }
        connection.destroy();
        return interaction.reply("Disconnecting...");
    },
};

