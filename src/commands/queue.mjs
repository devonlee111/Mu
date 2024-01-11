import { createDiscordQueueEmbed } from "../common/embeds.mjs";
import { ensureGetQueue, performSearchAndQueueWithRetry } from "../common/tools.mjs";

export const name = "queue";
export async function queue(message) {
	let queue = ensureGetQueue(message);

	let query = message.content.trim(); // we need input/query to play

	if (query == "") {
		let embedMessage = createDiscordQueueEmbed(queue, message);
		message.channel.send({ embeds: [embedMessage] });
		return;
	}

	await performSearchAndQueueWithRetry(message, query);
	return;
}
