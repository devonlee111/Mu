module.exports = {
	name: "loop",
    async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.getQueue(message.guild);
		if (queue != undefined) {
			if (queue.repeatMode == 1) {
				console.log("alright. will stop looping current track");
				queue.setRepeatMode(0);
			} else {
				console.log("ok. looping current track");
				queue.setRepeatMode(1);
			}
		} else {
			message.reply("hmm... nothing's queued or playing, can't loop");
			console.log("no queue to loop");
		}
	},
};
