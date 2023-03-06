module.exports = {
	name: "loopq",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			message.reply("There is no queue to loop");
			return;
		}

		if (queue.repeatMode == 2) {
			message.reply("alright. will stop looping whole queue");
			queue.setRepeatMode(0);
		} else {
			message.reply("ok. looping whole queue");
			queue.setRepeatMode(2);
		}
	},
};
