const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { youtubeAPI } = require('../config.json');
const audioPlayer = require('../audioPlayer.js');
const player = require('../audioPlayer.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses Mμse.'),
    async execute(interaction, message) {
        // Check if command was from message or slash command and handle accordingly
        if (interaction == null) {
            if (message == null) {
                // Should not happen
                console.log('no interaction or message provided');
                return;
            }
            interaction = message;
        }

        // Attempt to connect to voice channel if not already connected
        let connection = getVoiceConnection(interaction.guildId);
        if (connection == null) {
            return interaction.reply('Not currently in a voice channel.');
        }

        let guild = interaction.guildId;

        // Check that guild exists in guildQueues
        if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
            let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            let player = audioPlayer.guildQueues[guildIndex].player;

            if (player == null) {
                return;
            }

            player.pause();
        }       
        return interaction.reply('Pausing playback...');
    },
};

