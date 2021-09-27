const play = require('play-dl');
const { createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { youtubeAPI } = require('../config.json');
const audioPlayer = require('../audioPlayer.js');
const join = require('./join.js')
const command = "!play"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song!')
        .addStringOption(option => option.setName('song').setDescription('Enter a string')),
    async execute(interaction, message) {
        let originalInteraction = interaction;
        let originalMessage = message;
        let toPlay = null;

        // Check if command was from message or slash command and handle accordingly
        if (interaction == null) {
            if (message == null) {
                // Should not happen
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

        if (toPlay == null) {
            let guild = interaction.guildId;
            if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
                let player = audioPlayer.guildQueues[guildIndex].player;
                if (player == null) {
                    return;
                }
                
                if (player.state.status == 'paused') {
                    player.unpause();
                    return interaction.reply('Mμse resuming playback...');
                } 
            }
   
            return interaction.reply('No song specified.');
        }

        // Attempt to connect to voice channel if not already connected
        let connection = getVoiceConnection(interaction.guildId);
        if (connection == null) {
            await join.execute(originalInteraction, originalMessage);
            connection = getVoiceConnection(interaction.guildId);
            if (connection == null) {
                return interaction.reply('Failed to connect to voice channel.');
            }
        }

        // Create new audio player
        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        // Handle audio player state changes
        player.on('stateChange', async (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            switch (newState.status) {
                // Attempt to auto play from queue when idle
                case 'idle':
                    // Get queue associated with guild that contains player
                    let playerIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.player == player));
                    let queue = audioPlayer.guildQueues[playerIndex].queue;

                    // Check if queue is empty
                    if (queue.length == 0) {
                        return
                    }

                    // Get next song in queue
                    let nextSong = audioPlayer.guildQueues[playerIndex].queue.pop();                    

                    // Get audio stream
                    let source = await play.stream(nextSong);
                    let audioResource = createAudioResource(source.stream, {
                        inputType : source.type
                    });
                    player.play(audioResource);

                    break;
            }
        });

        // Handle audio player errors.
        player.on('error', error => {
            console.log(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        });

        connection.subscribe(player);

        // Save audio player in guildQueues
        let guild = interaction.guildId;
        if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
            var guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            audioPlayer.guildQueues[guildIndex].player = player;
        }
        else {
            audioPlayer.guildQueues.push({ guild: guild, queue: [], player: player });
        } 

        // Get audio stream
        let source = await play.stream(toPlay);
        let audioResource = createAudioResource(source.stream, {
            inputType : source.type
        });
        player.play(audioResource);
        
        return interaction.reply(`Now playing \`${toPlay}\``);
    },
};

