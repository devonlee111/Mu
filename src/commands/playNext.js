const { useMainPlayer } = require("discord-player");
const tools = require("../common/tools.js");

module.exports = {
	name: "playnext",
	// 1. Queue any media provided by user to play after current track finishes
	// 2. Play immediately if nothing is currently playing
	// Does not resume playing if paused

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
			message.reply(`you've provided nothing to play next`);
			return;
		}

		await tools.performSearchAndQueueWithRetry(
			message,
			query,
			(trackIndex = 0)
		);
	},
};
