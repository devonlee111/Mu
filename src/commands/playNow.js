const { useMainPlayer } = require("discord-player");
const tools = require("../common/tools.js");

module.exports = {
	name: "playnow",
	// 1. Play any track given by user to play immediately
	// 1a. Get information and requeue currently playing track to play next if currently playing
	// Does resume playing if paused or otherwise not playing

	async execute(message) {
		let player = useMainPlayer();
		let queue = tools.ensureGetQueue(message);
		let channel = message.member.voice.channel;

		if (!channel) {
			return message.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
		}

		let query = message.content.trim(); // we need input/query to play
		await tools.ensureVoiceChannelConnection(message);

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
		await tools.performSearchAndQueueWithRetry(
			message,
			query,
			(trackIndex = 0)
		);

		if (queue.node.isPaused()) {
			queue.node.resume();
			message.reply(`resuming playback`);
		}
		/*if (!queue.node.isPlaying()) {
			queue.node.play();
			message.reply(`beginning playback`);
		}*/

		queue.node.skip();
	},
};
