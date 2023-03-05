module.exports = {
	name: "stop",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue != undefined) {
			queue.tracks.clear();
			queue.tracks.skip();
			message.reply("ok, stopping...");
		} else {
			console.log("no queue to stop");
		}
	},
};
