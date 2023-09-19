const tools = require("../common/tools.js");

module.exports = {
	name: "loop",
	async execute(message) {
		let queue = tools.ensureGetQueue(message);
		
		if (queue.repeatMode == 1) {
			message.reply("alright. will stop looping current track");
			queue.setRepeatMode(0);
			return;
		}

		message.reply("ok. looping current track");
		queue.setRepeatMode(1);
		return;
	},
};
