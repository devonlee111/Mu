module.exports = {
	name: "stop",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			message.reply("There is no queue to stop");
			return;
		}

		queue.tracks.clear();
		queue.tracks.skip();
		message.reply("ok, stopping...");
	},
};
