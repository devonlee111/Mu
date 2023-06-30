module.exports = {
	name: "disconnect",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			message.reply("I'm not currently connected");
			return;
		}

		queue.delete(true);
		message.reply("goodbye");
	},
};
