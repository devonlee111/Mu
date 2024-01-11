export const name = "ping";
export async function ping(message) {
	let now = new Date();
	let lagTime = (now - message.createdAt);
	message.reply("Pong! " + "`" + lagTime + "ms`");
}
