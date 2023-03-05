module.exports = {
	name: "clear",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue != undefined) {
			queue.tracks.clear();
			message.reply("ok, clearing the rest of the queue");
		} else {
			console.log("no queue to clear");
		}
	},
};
