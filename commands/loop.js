module.exports = {
	name: "loop",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			message.reply("There is nothing playing for me to loop");
			return;
		}

		if (queue.repeatMode == 1) {
			message.reply("alright. will stop looping current track");
			queue.setRepeatMode(0);
		} else {
			message.reply("ok. looping current track");
			queue.setRepeatMode(1);
		}
	},
};
