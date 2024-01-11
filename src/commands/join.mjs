import { ensureGetQueue, ensureVoiceChannelConnection } from "../common/tools.mjs";

export const name = "join";
export async function join(message) {
	await ensureVoiceChannelConnection(message);
}
