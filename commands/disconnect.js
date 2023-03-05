module.exports = {
	name: "disconnect",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue != undefined) {
			queue.delete(true);
		} else {
			console.log("no queue to disconnect");
		}
	},
};
