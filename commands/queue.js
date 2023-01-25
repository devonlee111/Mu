const { EmbedBuilder, Embed } = require('discord.js');

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
				embedMessage = createDiscordQueueEmbed(queue);
				message.channel.send({ embeds: [embedMessage] });
			} else {
				message.reply("you didn't specify something for me to queue");
			}
			
		}
	},
};

// Creates a discord embed for showing the current queue
function createDiscordQueueEmbed(queue) {
	nowPlaying = undefined;
	if (queue.playing) {
		nowPlaying = queue.nowPlaying();
	}
	let queueEmbed = new EmbedBuilder()
		.setColor('#ffc5f7')
		.setTitle('Current Queue')
		.setDescription('Listing current queue')
		.setTimestamp();

	let queueString = "";

	// nothing currently playing and nothing in queue
	if (queue.tracks.length == 0) {
		queueString = "Queue Empty";
	}
	else { 
		if (nowPlaying) {
			queueString = "**>** " + nowPlaying.title + " **<**\n";
		}
		for (var i = 0; i < queue.tracks.length; i++) {
			let rowString = "\n" + (i + 1) + ". " + queue.tracks[i].title + "\n";
			queueString += rowString;
		}
	}

	queueEmbed.addFields(
		{ name: 'Queue', value: queueString },
		{ name: '\u200B', value: '\u200B' },
	);

	return queueEmbed;
}

/*
// Creates a discord embed for queueing a specific media entry
function createDiscordQueueMediaEmbed(entry) {
	let entryEmbed = new MessageEmbed()
		.setColor('#ffc5f7')
		.setTitle('Media Queued')
		.setDescription('Queueing requested media')
		.addFields(
			{ name: 'Title', value: entry.title, inline: true },
			{ name: 'Uploader', value: entry.channel, inline: true },
			{ name: 'Duration', value: entry.duration, inline: true },
			{ name: '\u200B', value: '\u200B' },
		)
		.setTimestamp()
		.setFooter({ text: entry.url });

	return entryEmbed;
}

function createDiscordQueuePlaylistEmbed(playlist) {
	var playlistEmbed = new MessageEmbed()
		.setColor('#ffc5f7')
		.setTitle('Playlist Queued')
		.setDescription('Queueing requested playlist')
		.addFields(
			{ name: 'Title', value: playlist.title, inline: true },
			{ name: 'Length', value: playlist.videoCount.toString(), inline: true },
			{ name: '\u200B', value: '\u200B' },
		)
		.setTimestamp()
		.setFooter({ text: playlist.url });

	return playlistEmbed;
}
*/
