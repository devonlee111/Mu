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

		queue.setRepeatMode(0);
		queue.tracks.clear();
		queue.node.skip();
		message.reply("ok, stopping...");
	},
};
