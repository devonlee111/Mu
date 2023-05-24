const tools = require("../common/tools.js");

module.exports = {
	name: "play",
	// 1.  Queue any media provided by user
	// 2a. Resume playing if it is paused
	// 2b. Start playing if it is not currently playing
	async execute(message, player = undefined) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let query = message.content.trim();
		let queue = tools.ensureGetQueue(player, message);

		if (!(await tools.ensureVoiceChannelConnection(queue, message))) {
			return;
		}

		// Handle empty query case
		if (query == "") {
			if (queue.node.isPaused()) {
				queue.node.resume();
				return;
			}

			if (queue.isEmpty() || queue.node.isPlaying()) {
				message.reply("you didn't specify something for me to play");
				return;
			}

			console.log("not playing anything, begin playing");
			try {
				await queue.node.play();
			} catch (e) {
				console.log(e.message);
				message.reply(`failed to play that: ${e}`);
				return;
			}
			return;
		}

		if (
			!(await tools.performSearchAndQueueWithRetry(
				player,
				queue,
				message,
				query
			))
		) {
			return;
		}

		if (!queue.node.isPlaying()) {
			try {
				await queue.node.play();
			} catch (e) {
				console.log(e.message);
				message.reply(`failed to play that: ${e}`);
				return;
			}
		}
	},
};
