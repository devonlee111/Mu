import { ensureGetQueue } from "../common/tools.mjs";


export async function skip(message) {
	let queue = ensureGetQueue(message);

	queue.node.skip();
	message.reply("skipping to next track...");
	return;
}
