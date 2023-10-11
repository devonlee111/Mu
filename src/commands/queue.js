const embeds = require("../common/embeds.js");
const tools = require("../common/tools.js");

module.exports = {
	name: "queue",
	async execute(message) {
		let queue = tools.ensureGetQueue(message);

		let query = message.content.trim(); // we need input/query to play

		if (query == "") {
			let embedMessage = embeds.createDiscordQueueEmbed(queue, message);
			message.channel.send({ embeds: [embedMessage] });
			return;
		}

		await tools.performSearchAndQueueWithRetry(message, query);
		return;
	},
};
