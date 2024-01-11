import { ensureGetQueue } from "../common/tools.mjs";

export const name = "stop";
export async function stop(message) {
	let queue = ensureGetQueue(message);

	queue.delete();
	return;
}
