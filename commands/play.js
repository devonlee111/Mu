const embeds = require("../common/embeds.js");
const tools = require("../common/tools.js");

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
		let queue = tools.ensureGetQueue(player, message);

		if (!(await tools.ensureVoiceChannelConnection(queue, message))) {
			return;
		}

		// Handle empty query case
		if (query == "") {
			if (queue.node.isPaused()) {
				queue.node.resume();
				return;
			}

			if (queue.isEmpty() && !queue.node.isPlaying()) {
				message.reply("you didn't specify something for me to play");
				return;
			}

			console.log("not playing anything, begin playing");
			try {
				await queue.node.play();
			} catch (e) {
				console.log(e.message);
				message.reply(`failed to play that: ${e}`);
				return;
			}
			return;
		}

		// Handle non-empty query case
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

		if (!queue.node.isPlaying()) {
			try {
				await queue.node.play();
			} catch (e) {
				console.log(e.message);
				message.reply(`failed to play that: ${e}`);
				return;
			}
		}
	},
};
