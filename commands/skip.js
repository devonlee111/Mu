module.exports = {
	name: "skip",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue != undefined) {
			queue.node.skip();
			message.reply("skipping to next track...");
		} else {
			console.log("no queue to skip");
		}
	},
};
