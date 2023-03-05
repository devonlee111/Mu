module.exports = {
	name: "loopq",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue != undefined) {
			if (queue.repeatMode == 2) {
				console.log("alright. will stop looping whole queue");
				queue.setRepeatMode(0);
			} else {
				console.log("ok. looping whole queue");
				queue.setRepeatMode(2);
			}
		} else {
			message.reply("hmm... nothing's queued, can't loop");
			console.log("no queue to loop");
		}
	},
};
