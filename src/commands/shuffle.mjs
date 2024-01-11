import { ensureGetQueue } from "../common/tools.mjs";

export const name = "shuffle";
export async function shuffle(message) {
	let queue = ensureGetQueue(message);

	queue.tracks.shuffle();
	message.reply("I have shuffled everything around for you");
}
