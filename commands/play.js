const play = require('play-dl');
const { createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');
const join = require('./join.js');
const queue = require('./queue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song!')
        .addStringOption(option => option.setName('song').setDescription('Enter a string')),
    async execute(interaction, message) {
        let originalInteraction = interaction;
        let originalMessage = message;
        let toQueue = null;

        // Check if command was from message or slash command and handle accordingly
        if (interaction == null) {
            if (message == null) {
                // Should not happen
                console.log('no interaction or message provided');
                return
            }
            content = message.content.trim();
            if (content != "") {
                toQueue = content;
            }
            interaction = message;
        }
        else {
            toQueue = interaction.options.getString('song');
        }

        let guild = interaction.guildId;
        let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
        let player = null;

        // Check if there is a song argument
        if (toQueue != null) {
            // Queue the song to be played
            await queue.execute(originalInteraction, originalMessage);
        }
        else {
            // If not connected/no queue
            if (guildIndex == -1) {
                    return interaction.reply('There is nothing for me to play.');
            }
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

        guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
 
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
                        let currSong = audioPlayer.guildQueues[guildIndex].queue[0];
                        let nextSong = '';

                        // Check if loop and replace song based on loop type
                        if (audioPlayer.guildQueues[guildIndex].loop == true) {
                            nextSong = currSong;
                        }
                        // Check if loop all and replace song at end of queue
                        else if (audioPlayer.guildQueues[guildIndex].loopAll == true) {
                            audioPlayer.guildQueues[guildIndex].queue.shift();
                            audioPlayer.guildQueues[guildIndex].queue.push(currSong);
                            nextSong = audioPlayer.guildQueues[guildIndex].queue[0];
                        }
                        else {
                            if (audioPlayer.guildQueues[guildIndex].queue.length <= 1) {
                                console.log('end of queue');
                                audioPlayer.guildQueues[guildIndex].queue[0] = '';
                                audioPlayer.guildQueues[guildIndex].player.stop();
                                audioPlayer.guildQueues[guildIndex].player = null;
                                return;
                            }

                            // Remove currently playing song
                            audioPlayer.guildQueues[guildIndex].queue.shift();
                            nextSong = audioPlayer.guildQueues[guildIndex].queue[0];
                        }                        
  
                        // Get audio stream of next song
                        let source = await play.stream(nextSong);
                        let audioResource = createAudioResource(source.stream, {
                            inputType : source.type
                        });

                        // Play song                 
                        player.play(audioResource);

                        // Set guildQueue currently playing song
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
        // Audio player already exists for guild
        else {
            player = audioPlayer.guildQueues[guildIndex].player;
            
            // Resume playback if paused
            if (player.state.status == 'paused') {
                player.unpause();
                return interaction.reply('Mμse resuming playback...');
            }
            // Do nothing if currently playing
            else if (player.state.status == 'playing') {
                return;
            }
            // If idle, no entries in queue
            else if (player.state.status == 'idle') {
                if (audioPlayer.guildQueues[guildIndex].queue.length < 2) {
                    return interaction.reply('There is nothing for me to play...');
                }
            }
        }

        // Play initial song
        let nextSong = audioPlayer.guildQueues[guildIndex].queue[1];
        audioPlayer.guildQueues[guildIndex].queue.shift();

        // Get audio stream
        if (nextSong == null || nextSong == '') {
            return;
        }

        console.log(nextSong);

        let source = await play.stream(nextSong);
        let audioResource = createAudioResource(source.stream, {
            inputType : source.type
        });

        // Play song
        player.play(audioResource);

        return interaction.reply(`Now playing \`${nextSong}\``);
    },
};

