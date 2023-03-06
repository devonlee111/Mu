module.exports = {
	name: "shuffle",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			message.reply("There is nothing for me to shuffle");
			return;
		}

		queue.tracks.shuffle();
		message.reply("I have shuffled everything around for you");
	},
};
