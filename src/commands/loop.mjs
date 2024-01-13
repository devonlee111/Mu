import { ensureGetQueue } from "../common/tools.mjs";


export async function loop(message) {
	let queue = ensureGetQueue(message);

	if (queue.repeatMode == 1) {
		message.reply("alright. will stop looping current track");
		queue.setRepeatMode(0);
		return;
	}

	message.reply("ok. looping current track");
	queue.setRepeatMode(1);
	return;
}
