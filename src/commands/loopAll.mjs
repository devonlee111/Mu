import { ensureGetQueue } from "../common/tools.mjs";

export const name = "loopq";
export async function loopAll(message) {
	let queue = ensureGetQueue(message);

	if (queue.repeatMode == 2) {
		message.reply("alright. will stop looping whole queue");
		queue.setRepeatMode(0);
		return;
	}

	message.reply("ok. looping whole queue");
	queue.setRepeatMode(2);
}
