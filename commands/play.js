const { createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');

const ytdl = require('ytdl-core');
const dytdl = require('discord-ytdl-core');
const playdl = require('play-dl');

const join = require('./join.js');
const queue = require('./queue.js');

module.exports = {
	name: "play",
	// 1.  Queue any media provided by user
	// 2a. Resume playing if it is paused
	// 2b. Start playing if it is not currently playing
	async execute(guildInfo, message) {
		let guildID = message.guildId;
		let guildAudioInfo = guildInfo.audioInfo;
		let connection = null;
		let player = null;
	
		// Queue any media provided by the user
		content = message.content.trim();
		if (content != "") {
			let toQueue = content;
			entry = await queue.queueAudio(guildAudioInfo, toQueue);
			entryEmbed = queue.createDiscordQueueMediaEmbed(entry);
			message.channel.send({ embeds: [entryEmbed] });
			// message.reply();
		}	

		// Check if there is anything left to play in the queue
		if (guildAudioInfo.queue.length == 0) {
			console.log("nothing to play");
			return;
		}	

		// Connect to voice channel if not connected to one already
		connection = getVoiceConnection(guildID);
		if (connection == undefined) {
			console.log("not connected to voice channel, attempting to join first");
			try {
				connection = join.joinChannel(message.member.voice.channel);
			} catch(e) {
				// TODO error handling
				console.log(e.message);
				return;
			}
		}

		// Create new audio player if one does not exist for the guild		
		if (guildAudioInfo.subscription == null) {
			console.log("no subscription found")
			console.log("creating new player...");
			let newPlayer = createPlayer(guildInfo);

			console.log("subscribing connection to new player...");
			let subscription = connection.subscribe(newPlayer);
			guildAudioInfo.subscription = subscription;
		}

		player = guildAudioInfo.subscription.player;

		// Handle switching to playing state
		// Unpause if paused
		// Do nothing if already playing
		switch(player.state.status) {
			case 'paused':
				console.log("resumed playing");
				player.unpause();
				return;
				break;

			case 'playing':
				console.log("already playing something");
				return;
				break;
		}
	
		playNext(guildAudioInfo);
	},
	playNext,
};

// Create a new player with default handlers
function createPlayer(guildInfo) {
	player = createAudioPlayer({
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
				var guildAudioInfo = guildInfo.audioInfo;
				var lastPlaying = guildAudioInfo.nowPlaying;
				guildAudioInfo.cycleQueue();
				var nowPlaying = guildAudioInfo.nowPlaying;
				if (nowPlaying == null) {
					if (guildAudioInfo.autoplay) {
						if (lastPlaying != null) {
							try {
								var url = await(queue.getNextPlaying(lastPlaying.url));
								await queue.queueAudio(guildAudioInfo, url);
								guildAudioInfo.cycleQueue();
								nowPlaying = guildAudioInfo.nowPlaying;
							}
							catch(e) {
								console.log(e.message);
								return;
							}
						}
						else {
							// last playing is null... somehow
							// TODO do something
							return;
						}
					}
					else {
						console.log('Nothing left to play');
						return;
					}
				}

				var stream = ytdl(nowPlaying.url, { filter: 'audioonly' });
				var resource = createAudioResource(stream);

				player.play(resource);
				break;
		}
	});

	// Handle audio player errors.
	player.on('error', error => {
		console.log(error);
	});

	return player;
}

// Cycle to next item in queue
// Play the current audio
async function playNext(guildAudioInfo) {
	var player = guildAudioInfo.subscription.player;
	var lastPlaying = guildAudioInfo.nowPlaying;

	guildAudioInfo.cycleQueue();

	nowPlaying = guildAudioInfo.nowPlaying;
	if (nowPlaying == null) {
		if (guildAudioInfo.autoplay) {
			if (lastPlaying != null) {
				try {
					var url = await(queue.getNextPlaying(lastPlaying.url));
					await queue.queueAudio(guildAudioInfo, url);
					guildAudioInfo.cycleQueue();
					nowPlaying = guildAudioInfo.nowPlaying;
				}
				catch(e) {
					console.log(e.message);
					player.stop();
					return;
				}
			}
			else {
				// last playing is null... somehow
				// TODO do something
				player.stop();
				return;
			}
		}
		else {
			player.stop();
			console.log('Nothing left to play');
			return;
		}
	}

	/*
	// node-ytdl-core version
	// has issues with disconnects after a while
	var stream = ytdl(nowPlaying.url, {
		filter: 'audioonly',
		highWaterMark: 1 << 62,
		liveBuffer: 1 << 62,
		dlChunkSize: 0, // disabaling chunking is recommended in discord bot
		bitrate: 128,
		//quality: "lowestaudio",
	});
	*/

	/*

	// discord-ytdl-core version
	// generates EPIPE error immediately
	/*
	var stream = dytdl(nowPlaying.url, {
		filter: 'audioonly',
		opusEncoded: true,
	});
	*/
	
	// var resource = createAudioResource(stream);

	// play-dl version
	source = await playdl.stream(nowPlaying.url);

	var resource = createAudioResource(source.stream, {
		inputType : source.type
	});
	
	player.play(resource);
}

