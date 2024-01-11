import { ensureGetQueue } from "../common/tools.mjs";

export const name = "clear";
export async function clear(message) {
	let queue = ensureGetQueue(message);

	queue.tracks.clear();
	message.reply("ok, clearing the rest of the queue");
	return;
}
