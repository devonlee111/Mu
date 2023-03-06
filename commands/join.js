const tools = require("../common/tools.js");

module.exports = {
	name: "join",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			queue = tools.createQueue(player, message);
		}

		await tools.ensureVoiceChannelConnection(queue, message);
	},
};
