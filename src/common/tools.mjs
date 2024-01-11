import { useMainPlayer, useQueue } from "discord-player";
import { createDiscordQueuePlaylistEmbed, createDiscordQueueMediaEmbed } from "./embeds.mjs";

export async function ensureVoiceChannelConnection(message) {
	let queue = ensureGetQueue(message);

	if (queue.connection != undefined) {
		return true;
	}

	try {
		await queue.connect(message.member.voice.channel);
	} catch (e) {
		console.log(e.message);
		message.reply("oh no. I can't join the vc");
		queue.delete();
		return false;
	}
	return true;
}
export function ensureGetQueue(message) {
	return getCreateQueue(message);
}
export async function performSearchAndQueueWithRetry(message,
	query,
	trackIndex = -1,
	engine = "youtubeSearch",
	maxRetries = 3) {
	for (let retries = 0; retries < maxRetries; retries++) {
		if (await performSearchAndQueue(message, query, engine, trackIndex)) {
			return true;
		}

		if (retries == retryCount) {
			return false;
		}
	}
	return false;
}

function getCreateQueue(message) {
	let player = useMainPlayer(message.guild.id);
	let queue = player.nodes.get(message.guild);
	if (queue == null) {
		console.log("create queue");
		return createQueue(message);
	}
	console.log("queue exists");
	return queue;
}

function createQueue(message) {
	let player = useMainPlayer(message.guild.id);
	let queue = player.nodes.create(message.guild, {
		metadata: {
			channel: message.channel,
			client: message.guild.members.me,
			requestedBy: message.author,
		},
		selfDeaf: true,
		volume: 80,
		leaveOnEmpty: true,
		leaveOnEnd: false,
	});
	return queue;
}

async function performSearchAndQueue(message, query, engine, trackIndex = -1) {
	let player = useMainPlayer();
	let queue = getCreateQueue(message);
	let search = await player.search(query, {
		requestedBy: message.author.displayName,
		searchEngine: engine,
	});

	if (!search) {
		return false;
	}

	let tracks = undefined;
	let embedMessage = undefined;

	if (search.playlist) {
		// Handle playlist of tracks
		tracks = search.tracks;
		if (tracks == undefined) {
			return false;
		}

		embedMessage = createDiscordQueuePlaylistEmbed(search.playlist);
	} else {
		// Handle individual track
		console.log(search.tracks);
		tracks = search.tracks[0];
		console.log(tracks);
		if (tracks == undefined) {
			return false;
		}

		embedMessage = createDiscordQueueMediaEmbed(tracks);
	}

	console.log("queue ", queue);
	if (trackIndex == -1) {
		queue.addTrack(tracks);
	} else {
		queue.insertTrack(tracks, trackIndex);
	}
	message.channel.send({ embeds: [embedMessage] });

	return true;
}
