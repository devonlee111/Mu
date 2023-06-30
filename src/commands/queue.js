const embeds = require("../common/embeds.js");
const tools = require("../common/tools.js");

module.exports = {
	name: "queue",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		query = message.content.trim();
		let queue = tools.ensureGetQueue(player, message);

		if (query == "") {
			let embedMessage = embeds.createDiscordQueueEmbed(queue);
			message.channel.send({ embeds: [embedMessage] });
			return;
		}

		if (
			!(await tools.performSearchAndQueueWithRetry(
				player,
				queue,
				message,
				query
			))
		) {
			return;
		}
	},
};
