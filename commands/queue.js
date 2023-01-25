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
			let song = await player.search(query, {
				requestedBy: message.author
			});

			if (!song) {
				message.reply("whoops. I wasn't able to find that for you");
				return;
			}

			if (song.playlist) {
				queue.addTracks(song.tracks);
			} else {
				queue.addTrack(song.tracks[0]);
			}

		} else {
			let queue = player.getQueue(message.guild);
			if (queue != undefined) {
				for (const track of queue.tracks) {
					console.log(track);
				}
			} else {
				message.reply("you didn't specify something for me to queue");
			}
			
		}
	},
};
