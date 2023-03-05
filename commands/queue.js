const embeds = require("../common/embeds.js");

module.exports = {
	name: "queue",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		query = message.content.trim();
		if (query != "") {
			let queue = player.nodes.get(message.guild);
			let search = await player.search(query, {
				requestedBy: message.author,
			});

			if (!search) {
				message.reply("whoops. I wasn't able to find that for you");
				return;
			}

			let tracks = undefined;
			let embedMessage = undefined;
			if (search.playlist) {
				tracks = search.tracks;
				embedMessage = embeds.createDiscordQueuePlaylistEmbed(tracks);
			} else {
				tracks = search.tracks[0];
				embedMessage = embeds.createDiscordQueueMediaEmbed(tracks);
			}
			queue.addTrack(tracks);
			message.channel.send({ embeds: [embedMessage] });
		} else {
			let queue = player.nodes.get(message.guild);
			if (queue != undefined) {
				embedMessage = embeds.createDiscordQueueEmbed(queue);
				message.channel.send({ embeds: [embedMessage] });
			} else {
				message.reply("you didn't specify something for me to queue");
			}
		}
	},
};
