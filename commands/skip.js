const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');
const play = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song.'),
    async execute(interaction, message) {
        let originalInteraction = interaction;
        let originalMessage = message;
        originalMessage.content = '';

        if (interaction == null) {
            if (message == null) {
                // Should not happen
                console.log('no interaction or message provided');
                return
            }
            interaction = message;
        }

        let guild = interaction.guildId;
        let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
        // If guild not in guildQueues
        if (guildIndex == -1) {
            return interaction.reply('I\'m not currently playing anything');            
        }

        let player = audioPlayer.guildQueues[guildIndex].player;
        if (player == null) {
            return interaction.reply('I\'m not currently playing anything');            
        }

        //audioPlayer.guildQueues[guildIndex].queue.shift();
        console.log(audioPlayer.guildQueues[guildIndex].queue);
        audioPlayer.guildQueues[guildIndex].player.stop();
        //audioPlayer.guildQueues[guildIndex].player = null;
        await play.execute(originalInteraction, originalMessage);

        return interaction.reply('skipped');
    },
};

