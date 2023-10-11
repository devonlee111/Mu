const tools = require("../common/tools.js");

module.exports = {
	name: "join",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = tools.ensureGetQueue(message);

		await tools.ensureVoiceChannelConnection(message);
	},
};
