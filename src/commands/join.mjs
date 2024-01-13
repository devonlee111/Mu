import { ensureVoiceChannelConnection } from "../common/tools.mjs";


export async function join(message) {
	await ensureVoiceChannelConnection(message);
}
