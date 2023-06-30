const embeds = require("embeds.js");

module.exports = {
	async ensureVoiceChannelConnection(queue, message) {
		if (queue.connection == undefined) {
			try {
				await queue.connect(message.member.voice.channel);
			} catch (e) {
				console.log(e.message);
				message.reply("oh no. I can't join the vc");
				queue.delete();
				return false;
			}
		}
		return true;
	},
	ensureGetQueue(player, message) {
		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			queue = createQueue(player, message);
		} else {
			queue = player.nodes.get(message.guild);
		}
		return queue;
	},
	async performSearchAndQueueWithRetry(
		player,
		queue,
		message,
		query,
		engine = "youtubeSearch",
		maxRetries = 3
	) {
		for (let retries = 0; retries < maxRetries; retries++) {
			if (await performSearchAndQueue(player, queue, message, query, engine)) {
				return true;
			} else if (retries == retryCount) {
				message.reply(
					"o noes. that search faiwed. pwease try a different link or search"
				);
				return false;
			}
		}
		return false;
	},
};

function createQueue(player, message) {
	queue = player.nodes.create(message.guild, {
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

async function performSearchAndQueue(player, queue, message, query, engine) {
	let search = await player.search(query, {
		requestedBy: message.author,
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

		embedMessage = embeds.createDiscordQueuePlaylistEmbed(search.playlist);
	} else {
		// Handle individual track
		console.log(search.tracks);
		tracks = search.tracks[0];
		console.log(tracks);
		if (tracks == undefined) {
			return false;
		}

		embedMessage = embeds.createDiscordQueueMediaEmbed(tracks);
	}

	queue.addTrack(tracks);
	message.channel.send({ embeds: [embedMessage] });

	return true;
}
