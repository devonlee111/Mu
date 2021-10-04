const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop currently playing song.'),
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
            audioPlayer.guildQueues[guildIndex].loop = !audioPlayer.guildQueues[guildIndex].loop; 

            if (audioPlayer.guildQueues[guildIndex].loop) {
                return 'Ok. Looping currently playing song.';
            }
            else {
                return 'I\'m no longer looping the current song.';
            }
        }
        
        return 'I\'m ot currently playing anything.';
    }
};

