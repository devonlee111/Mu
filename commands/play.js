const play = require('play-dl');
const { createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { youtubeAPI } = require('../config.json');
const audioPlayer = require('../audioPlayer.js');
const join = require('./join.js');
const queue = require('./queue.js');
const command = "!play";

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

        let guild = interaction.guildId;

        if (toPlay == null) {
            // Check if guild is in guildQueues (is playing or has a queue)

            if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
                let player = audioPlayer.guildQueues[guildIndex].player;
                if (player == null) {
                    return;
                }
                
                // Resume playback if paused
                if (player.state.status == 'paused') {
                    player.unpause();
                    return interaction.reply('Mμse resuming playback...');
                }
                else if (player.state.status == 'playing') {
                    return interaction.reply('Mμse is already playing');
                }
                else if (player.state.status == 'idle') {
                    return interaction.reply('There is nothing for me to play...');
                }
            }
   
            return interaction.reply('No song specified.');
        }

        // Queue the song to be played
        await queue.execute(originalInteraction, originalMessage);

        // Attempt to connect to voice channel if not already connected
        let connection = getVoiceConnection(interaction.guildId);
        if (connection == null) {
            await join.execute(originalInteraction, originalMessage);
            connection = getVoiceConnection(interaction.guildId);
            if (connection == null) {
                return interaction.reply('Failed to connect to voice channel.');
            }
        }

        let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
        let player = null
        
        // Create new audio player if one does not exist for the guild
        if (audioPlayer.guildQueues[guildIndex].player == null) {
            player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });

            if (player == null) {
                console.log('something went wrong with creation of audio player');
                return;
            }

            // Handle audio player state changes
            player.on('stateChange', async (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
                switch (newState.status) {
                    // Attempt to auto play from queue when idle
                    case 'idle':
                        let nextSong = '';

                        // Check if loop and replace song based on loop type
                        if (audioPlayer.guildQueues[guildIndex].loop == true) {
                            nextSong = audioPlayer.guildQueues[guildIndex].currentSong;
                        }
                        else {
                            // Check if queue is empty
                            if (audioPlayer.guildQueues[guildIndex].queue.length == 0) {
                                return
                            }

                            // Get next song in queue
                            nextSong = audioPlayer.guildQueues[guildIndex].queue[0];

                            // Remove currently playing song
                            audioPlayer.guildQueues[guildIndex].queue.shift();

                            // TODO add loop all command
                            // Check if loop all and replace song at end of queue
                            if (audioPlayer.guildQueues[guildIndex].loopAll == true) {
                                audioPlayer.guildQueues[guildIndex].queue.push(nextSong);
                            }
                        }
                            
                        // Get audio stream of next song
                        let source = await play.stream(nextSong);
                        let audioResource = createAudioResource(source.stream, {
                            inputType : source.type
                        });
                 
                        player.play(audioResource);
                        audioPlayer.guildQueues[guildIndex].currentSong = nextSong;

                        break;
                }
            });

            // Handle audio player errors.
            player.on('error', error => {
                console.log(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
            });

            // Save audio player in guildQueues
            let guild = interaction.guildId;
            if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                audioPlayer.guildQueues[guildIndex].player = player;
            }

            connection.subscribe(player);
        }
        else {
            player = audioPlayer.guildQueues[guildIndex].player;
            if (player.state.status == 'playing') {
                return;
            }
        }

        // Get audio stream
        let source = await play.stream(toPlay);
        let audioResource = createAudioResource(source.stream, {
            inputType : source.type
        });
        player.play(audioResource);
        audioPlayer.guildQueues[guildIndex].currentSong = toPlay;
        
        return interaction.reply(`Now playing \`${toPlay}\``);
    },
};

