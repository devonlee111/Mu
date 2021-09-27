const { SlashCommandBuilder } = require('@discordjs/builders');
const player = require('../player.js');
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
        if (toPlay == null) {
            if (!player.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                return interaction.reply('No songs in queue.')
            }
            var guildIndex = player.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            guildQueue = player.guildQueues[guildIndex].queue;
            var reply = "";
            for (var i = 0; i < guildQueue.length; i++) {
                reply = reply + ", " + guildQueue[i];
            }
            return interaction.reply(reply);
        }
        else {
            if (player.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                var guildIndex = player.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
                player.guildQueues[guildIndex].queue.push(toPlay);
            }
            else {
                player.guildQueues.push({ guild: guild, queue: [toPlay] });
            }
            return interaction.reply(`\`${toPlay}\` has been added to the queue.`);
        }
    },
};

