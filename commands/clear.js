module.exports = {
	name: "clear",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			message.reply("No queue for me to clear");
			return;
		}

		queue.tracks.clear();
		message.reply("ok, clearing the rest of the queue");
	},
};
