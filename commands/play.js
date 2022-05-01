const { createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

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
			await queue.queueAudio(guildAudioInfo, toQueue);
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
			let newPlayer = createPlayer();

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
function createPlayer() {
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
				guildAudioInfo.cycleQueue();
				let nowPlaying = guildAudioInfo.nowPlaying;
				if (nowPlaying == null) {
					console.log('Nothing left to play');
					return;
				}

				let stream = ytdl(nowPlaying.url, { filter: 'audioonly' });
				let resource = createAudioResource(stream);

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
	player = guildAudioInfo.subscription.player;
	guildAudioInfo.cycleQueue();
	let nowPlaying = guildAudioInfo.nowPlaying;
	if (nowPlaying == null) {
		console.log('Nothing left to play');
		player.stop();
		return;
	}

	let stream = ytdl(nowPlaying.url, { filter: 'audioonly' });
	let resource = createAudioResource(stream);

	player.play(resource);
}

