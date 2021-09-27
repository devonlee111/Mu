const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a voice channel'),
        //.addStringOption(option => option.setName('channel').setDescription('Enter a string')),
    async execute(interaction) {
        //const channel = interaction.options.getString('channel')
        channel = interaction.member.voice.channel
        if (channel == null) {
            return interaction.reply('You are not in a voice channel!');
        }
        var connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });

        return interaction.reply("Connecting...");
    },
};

