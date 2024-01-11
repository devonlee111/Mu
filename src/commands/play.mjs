import { useMainPlayer } from 'discord-player';
import { ensureGetQueue, ensureVoiceChannelConnection } from "../common/tools.mjs";

export const name = "play";
export
	// 1.  Queue any media provided by user
	// 2a. Resume playing if it is paused
	// 2b. Start playing if it is not currently playing
	async function play(message) {
	let player = useMainPlayer();
	let queue = ensureGetQueue(message);
	let channel = message.member.voice.channel;

	if (!channel) {
		return message.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
	}

	let query = message.content.trim(); // we need input/query to play
	await ensureVoiceChannelConnection(message);

	if (query == "") {
		if (queue.node.isPaused()) {
			queue.node.resume();
			message.reply(`resuming playback`);
			return;
		}
		if (!queue.node.isPlaying()) {
			queue.node.play();
			message.reply(`beginning playback`);
			return;
		}
	}

	try {
		const { track } = await player.play(channel, query, {
			nodeOptions: {
				// nodeOptions are the options for guild node (aka your queue in simple word)
				metadata: message // we can access this metadata object using queue.metadata later on
			}
		});
		message.reply(`**${track.title}** enqueued!`);
		return;
	} catch (e) {
		// let's return error if something failed
		message.reply(`Something went wrong: ${e}`);
		return;
	}
}
