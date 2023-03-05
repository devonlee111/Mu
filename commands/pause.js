module.exports = {
	name: "pause",
	async execute(message, player = undefined) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue != undefined) {
			queue.node.pause();
		} else {
			console.log("there is no queue to pause");
		}
	},
};
