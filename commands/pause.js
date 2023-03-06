module.exports = {
	name: "pause",
	async execute(message, player = undefined) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			message.reply("there is no queue to pause");
			return;
		}

		queue.node.pause();
		message.reply("playback is paused");
	},
};
