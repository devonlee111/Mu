const { SlashCommandBuilder } = require('@discordjs/builders');
var player = require('../player.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Queue a song to play.')
        .addStringOption(option => option.setName('song').setDescription('Enter a string')),
    async execute(interaction) {
        const toPlay = interaction.options.getString('song');
        var guild = interaction.guildId;
        if (toPlay == null) {
            if (!player.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                return interaction.reply('No songs in queue.')
            }
            console.log(player.guildQueues)
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
                console.log("guild in queue");
                var guildIndex = player.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
                console.log(player.guildQueues[guildIndex])
                player.guildQueues[guildIndex].queue.push(toPlay);
            }
            else {
                console.log("guild not in queue");
                player.guildQueues.push({ guild: guild, queue: [toPlay] });
            }
            return interaction.reply(`\`${toPlay}\` has been added to the queue.`);
        }
    },
};

