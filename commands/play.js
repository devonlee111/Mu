const embeds = require('../common/embeds.js')

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

		query = message.content.trim();
		if (query != "") {
			let queue = player.getQueue(message.guild);
			if (queue == undefined) {
				options = {
					leaveOnEnd: false,
    				leaveOnEndCooldown: 1,
    				leaveOnStop: false,
    				leaveOnEmpty: false,
				}
				queue = player.createQueue(message.guild, options);
			} else {
				queue = player.getQueue(message.guild);
				console.log(queue.playing);
			}

			let song = await player.search(query, {
				requestedBy: message.author
			});
				
			// verify vc connection
			if (queue.connection == undefined) {
				try {
					await queue.connect(message.member.voice.channel);
				} catch(e) {
					console.log(e.message);
					message.reply("oh no. I can't join the vc");
					queue.destroy();
					return;
				}
			}

			if (!song) {
				message.reply("whoops. I wasn't able to find that for you");
				return;
			}

			if (song.playlist) {
				queue.addTracks(song.tracks);
				embedMessage = embeds.createDiscordQueuePlaylistEmbed(search.playlist);
				message.channel.send({ embeds: [embedMessage] });
			} else {
				queue.addTrack(song.tracks[0]);
				embedMessage = embeds.createDiscordQueueMediaEmbed(search.tracks[0])
				message.channel.send({ embeds: [embedMessage] });
			}

			if (!queue.playing) {
				queue.playing = true;
				await queue.play();
			}
		} else {
			let queue = player.getQueue(message.guild);
			if (queue == undefined) {
				message.reply("you didn't specify something for me to play");
			} else {
				// verify vc connection
				if (queue.connection == undefined) {
					try {
						await queue.connect(message.member.voice.channel);
					} catch(e) {
						console.log(e.message);
						message.reply("oh no. I can't join the vc");
						queue.destroy();
						return;
					}
				}
				if (!queue.playing) {
					console.log("not playing anything, begin playing");
					queue.playing = true;
					await queue.play();
				} else {
					if (queue.connection.paused) {
						queue.setPaused(false);
					}
				}
			}
		}
	},
};
