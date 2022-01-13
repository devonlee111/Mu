const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loopq')
        .setDescription('Loop current queue.'),
    async execute(interaction, message) {
        if (interaction == null) {
            if (message == null) {
                // should not happen
                console.log('no interaction or message provided');
                return
            }
            interaction = message;
        }
        else {
            toPlay = interaction.options.getString('song');
        }

        let guild = interaction.guildId;
        if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
            let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            audioPlayer.guildQueues[guildIndex].loopAll = !audioPlayer.guildQueues[guildIndex].loopAll; 

            if (audioPlayer.guildQueues[guildIndex].loopAll) {
                return 'Ok. Looping the current queue.';
            }
            else {
                return 'I\'m no longer looping the current queue.';
            }
        }
        
        return 'I\'m not currently playing anything';        
    }
};

