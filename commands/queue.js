const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');
const command = "!queue";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Queue a song to play.')
        .addStringOption(option => option.setName('song').setDescription('Enter a string')),
    async execute(interaction, message) {
        let toPlay = null;
        if (interaction == null) {
            if (message == null) {
                // should not happen
                console.log('no interaction or message provided');
                return
            }
            content = message.content.substring(command.length).trim();
            if (content != "") {
                toPlay = content;
            }
            interaction = message;
        }
        else {
            toPlay = interaction.options.getString('song');
        }

        let guild = interaction.guildId;
        // List out queue if no song specified
        if (toPlay == null) {
            // Check that guildQueue exists
            if (!audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                return interaction.reply('No songs in queue.')
            }

            let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            guildQueue = audioPlayer.guildQueues[guildIndex].queue;
            if (guildQueue.length == 0) { 
                return interaction.reply('No songs in queue.')
            }
            
            let reply = "";
            for (let i = 0; i < guildQueue.length; i++) {
                reply = reply + ", " + guildQueue[i];
            }
            return interaction.reply(reply);
        }
        else {
            // Check if guild exists in guildQueues
            if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
                audioPlayer.guildQueues[guildIndex].queue.push(toPlay);
            }
            else {
                // Create new guildQueue and set queue
                let entry = new audioPlayer.guildQueueEntry(guild);
                entry.queue = [ "", toPlay ]
                audioPlayer.guildQueues.push(entry);
            }
            return interaction.reply(`\`${toPlay}\` has been added to the queue.`);
        }
    },
};

