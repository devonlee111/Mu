const embeds = require("../common/embeds.js");

module.exports = {
	name: "play",
	// 1.  Queue any media provided by user
	// 2a. Resume playing if it is paused
	// 2b. Start playing if it is not currently playing
	async execute(message, player = undefined) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let query = message.content.trim();
		if (query != "") {
			let queue = player.nodes.get(message.guild);
			if (queue == undefined) {
				queue = queue = player.nodes.create({
					metadata: {
						channel: interaction.channel,
						client: interaction.guild.members.me,
						requestedBy: interaction.user,
					},
					selfDeaf: true,
					volume: 80,
					leaveOnEmpty: true,
					leaveOnEnd: false,
				});
			} else {
				queue = player.nodes.get(message.guild);
				console.log(queue.node.isPlaying);
			}

			let search = await player.search(query, {
				requestedBy: message.author,
			});

			// verify vc connection
			if (queue.connection == undefined) {
				try {
					await queue.connect(message.member.voice.channel);
				} catch (e) {
					console.log(e.message);
					message.reply("oh no. I can't join the vc");
					queue.delete();
					return;
				}
			}

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

			if (!queue.node.isPlaying()) {
				await queue.node.play();
			}
		} else {
			let queue = player.nodes.get(message.guild);
			if (queue == undefined) {
				message.reply("you didn't specify something for me to play");
			} else {
				// verify vc connection
				if (queue.connection == undefined) {
					try {
						await queue.connect(message.member.voice.channel);
					} catch (e) {
						console.log(e.message);
						message.reply("oh no. I can't join the vc");
						queue.delete();
						return;
					}
				}
				if (!queue.playing) {
					console.log("not playing anything, begin playing");
					queue.node.isPlaying = true;
					await queue.node.play();
				} else {
					if (queue.node.isPaused()) {
						queue.node.resume();
					}
				}
			}
		}
	},
};
