const tools = require("../common/tools.js");

module.exports = {
	name: "pause",
	async execute(message) {
		let queue = tools.ensureGetQueue(message);

		queue.node.pause();
		message.reply("playback is paused");
		return;
	},
};
