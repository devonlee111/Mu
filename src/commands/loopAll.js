const tools = require("../common/tools.js");

module.exports = {
	name: "loopq",
	async execute(message) {
		let queue = tools.ensureGetQueue(message);

		if (queue.repeatMode == 2) {
			message.reply("alright. will stop looping whole queue");
			queue.setRepeatMode(0);
			return;
		}

		message.reply("ok. looping whole queue");
		queue.setRepeatMode(2);
	},
};
