const tools = require("../common/tools.js");

module.exports = {
	name: "clear",
	async execute(message, player) {
		let queue = tools.ensureGetQueue(message);

		queue.tracks.clear();
		message.reply("ok, clearing the rest of the queue");
		return;
	},
};
