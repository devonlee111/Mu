import { ensureGetQueue } from "../common/tools.mjs";


export async function stop(message) {
	let queue = ensureGetQueue(message);

	queue.delete();
	return;
}
