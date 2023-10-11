const { useMainPlayer } = require('discord-player');

module.exports = {
	name: "disconnect",
	async execute(message) {
		let player = useMainPlayer()
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == null) {
			message.reply("I'm not currently connected");
			return;
		}

		queue.delete(true);
		message.reply("goodbye");
	},
};
