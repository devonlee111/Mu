const embeds = require("../common/embeds.js");
const tools = require("../common/tools.js");

module.exports = {
	name: "queue",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		query = message.content.trim();
		let queue = tools.ensureGetQueue(player, message);

		if (query == "") {
			let embedMessage = embeds.createDiscordQueueEmbed(queue);
			message.channel.send({ embeds: [embedMessage] });
			return;
		}

		let search = await player.search(query, {
			requestedBy: message.author,
			searchEngine: "youtubeSearch",
		});

		if (!search) {
			message.reply("whoops. I wasn't able to find that for you");
			return;
		}

		let tracks = undefined;
		let embedMessage = undefined;

		if (search.playlist) {
			tracks = search.tracks;
			console.log(tracks)
			if (tracks == undefined) {
				message.reply("o noes. that pwaywist is bwoken. pwease try a different link or search");
				return;
			}

			embedMessage = embeds.createDiscordQueuePlaylistEmbed(search.playlist);
		} else {
			console.log(search.tracks);
			tracks = search.tracks[0];
			if (tracks == undefined) {
				message.reply("o noes. that track is bwoken. pwease try a different link or search");
				return;
			}

			embedMessage = embeds.createDiscordQueueMediaEmbed(tracks);
		}

		queue.addTrack(tracks);
		message.channel.send({ embeds: [embedMessage] });
	},
};
