const embeds = require('../common/embeds.js')

module.exports = {
	name: "queue",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		query = message.content.trim();
		if (query != "") {
			let queue = player.createQueue(message.guild);
			let search = await player.search(query, {
				requestedBy: message.author
			});

			if (!search) {
				message.reply("whoops. I wasn't able to find that for you");
				return;
			}

			if (search.playlist) {
				queue.addTracks(search.tracks);
				embedMessage = embeds.createDiscordQueuePlaylistEmbed(search.playlist);
				message.channel.send({ embeds: [embedMessage] });
			} else {
				queue.addTrack(search.tracks[0]);
				embedMessage = embeds.createDiscordQueueMediaEmbed(search.tracks[0])
				message.channel.send({ embeds: [embedMessage] });
			}
		} else {
			let queue = player.getQueue(message.guild);
			if (queue != undefined) {
				embedMessage = embeds.createDiscordQueueEmbed(queue);
				message.channel.send({ embeds: [embedMessage] });
			} else {
				message.reply("you didn't specify something for me to queue");
			}
		}
	},
};
