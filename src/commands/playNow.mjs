import { useMainPlayer } from "discord-player";
import { ensureGetQueue, ensureVoiceChannelConnection, performSearchAndQueueWithRetry } from "../common/tools.mjs";


export
	// 1. Play any track given by user to play immediately
	// 1a. Get information and requeue currently playing track to play next if currently playing
	// Does resume playing if paused or otherwise not playing
	async function playNow(message) {
	let player = useMainPlayer();
	let queue = ensureGetQueue(message);
	let channel = message.member.voice.channel;

	if (!channel) {
		return message.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
	}

	let query = message.content.trim(); // we need input/query to play
	await ensureVoiceChannelConnection(message);

	if (query == "") {
		message.reply(`you've provided nothing to play now`);
		return;
	}

	// play immediately if queue is empty
	if (queue.isEmpty() && !queue.node.isPlaying()) {
		const { track } = await player.play(channel, query, {
			nodeOptions: {
				// nodeOptions are the options for guild node (aka your queue in simple word)
				metadata: message, // we can access this metadata object using queue.metadata later on
			},
		});
		message.reply(`**${track.title}** enqueued!`);
		return;
	}

	// insert next, and skip to given track if queue is not empty
	// unpause/begin playing if needed
	await performSearchAndQueueWithRetry(message, query, 0);

	if (queue.node.isPaused()) {
		queue.node.resume();
		message.reply(`resuming playback`);
	}

	queue.node.skip();
}
