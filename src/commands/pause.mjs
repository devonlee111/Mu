import { ensureGetQueue } from "../common/tools.mjs";


export async function pause(message) {
	let queue = ensureGetQueue(message);

	queue.node.pause();
	message.reply("playback is paused");
	return;
}
