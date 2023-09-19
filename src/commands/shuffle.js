const tools = require("../common/tools.js");

module.exports = {
	name: "shuffle",
	async execute(message) {
		let queue = tools.ensureGetQueue(message);

		queue.tracks.shuffle();
		message.reply("I have shuffled everything around for you");
	},
};
