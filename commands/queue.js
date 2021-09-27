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

        var guild = interaction.guildId;
        // List out queue if no song specified
        if (toPlay == null) {
            if (!audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                return interaction.reply('No songs in queue.')
            }
            var guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            guildQueue = audioPlayer.guildQueues[guildIndex].queue;
            var reply = "";
            for (var i = 0; i < guildQueue.length; i++) {
                reply = reply + ", " + guildQueue[i];
            }
            return interaction.reply(reply);
        }
        else {
            if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                var guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
                audioPlayer.guildQueues[guildIndex].queue.push(toPlay);
            }
            else {
                audioPlayer.guildQueues.push({ guild: guild, queue: [toPlay] });
            }
            return interaction.reply(`\`${toPlay}\` has been added to the queue.`);
        }
    },
};

