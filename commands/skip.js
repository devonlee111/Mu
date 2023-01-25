module.exports = {
    name: "skip",
    async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.getQueue(message.guild);
		if (queue != undefined) {
			queue.forceNext();
		} else {
			console.log("no queue to skip");
		}
	}
};

