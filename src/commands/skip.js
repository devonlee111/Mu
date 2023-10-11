const tools = require("../common/tools.js");

module.exports = {
	name: "skip",
	async execute(message) {
		let queue = tools.ensureGetQueue(message);

		queue.node.skip();
		message.reply("skipping to next track...");
		return;
	},
};
