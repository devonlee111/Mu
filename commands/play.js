const play = require('play-dl');
const { createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { youtubeAPI } = require('../config.json');
const command = "!play"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song!')
        .addStringOption(option => option.setName('song').setDescription('Enter a string')),
    async execute(interaction, message) {
        let toPlay = '';
        if (interaction == null) {
            if (message == null) {
                // Should not happen
                console.log('no interaction or message provided');
                return
            }
            content = message.content.substring(command.length).trim();
            toPlay = content;
            interaction = message;
        }
        else {
            toPlay = interaction.options.getString('song');
        }

        if (toPlay == null) {
            return interaction.reply('No song specified.');
        }

        let connection = getVoiceConnection(interaction.guildId);
        if (connection == null) {
            // Todo add join
        }

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        player.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        });

        player.on('error', error => {
            console.log(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        });

        connection.subscribe(player);
        
        let source = await play.stream(toPlay);
        let audioResource = createAudioResource(source.stream, {
            inputType : source.type
        });
        player.play(audioResource);
        
        return interaction.reply(`Now playing \`${toPlay}\``);
    },
};

