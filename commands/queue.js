const { MessageEmbed } = require('discord.js');

const wait = require('util').promisify(setTimeout);
const youtube = require('youtube-sr').default;

// Regex for verifying/finding youtube video in input
const ytVideoRegex = /https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/;
const ytPlaylistRegex = /https:\/\/www\.youtube\.com\/playlist\?list=/;
const linkPrefix = "https://";
const ytVideoPrefix = "https://www.youtube.com\/watch\?v=";

const guilds = require('../common/guilds.js');

module.exports = {
	name: "queue",
	async execute(guildInfo, message) {
		let guildID = message.guildId;
		let guildAudioInfo = guildInfo.audioInfo;
		let toQueue = null;

		content = message.content.trim();
		if (content != "") {
			toQueue = content;
		}

		// List out queue if no user input
		if (toQueue == null) {
			queueEmbed = createDiscordQueueEmbed(guildAudioInfo)
			message.channel.send({ embeds: [queueEmbed] });
			return;
		}
		// Queue the given media
		else {
			try {
				var embed = await queueAudio(message, guildAudioInfo, toQueue)
			} catch(e) {
				message.reply("failed to queue media: " + e.message);
				return
			}
			if (embed != null) {
				message.channel.send({ embeds: [embed] });
			}
		}
	},
	queueAudio,
	getNextPlaying,
	createDiscordQueueMediaEmbed,
};

// check what type of input user provided (search, video url, playlist url, invalid url)
// attempt to make a media entry out of provided input
async function queueAudio(message, guildAudioInfo, input) {
	inputType = "search";

	// check if link, and check which youtube link type if any
	if (input.startsWith(linkPrefix)) {
		if (validYoutubeVideo(input)) {
			inputType = "video";
		}
		else if (ytPlaylistRegex.test(input)) {
			inputType = "playlist";
		}
		else {
			inputType = "invalid";
		}
	}

	var embed = null;

	switch (inputType) {
		// create entry directly from supplied video URL
		case "video":
			entry = await(createMediaEntry(input));
			guildAudioInfo.queueAudioEntry(entry);
			embed = createDiscordQueueMediaEmbed(entry);
			break;

		case "playlist":
			// queue every entry from playlist
			message.reply("queueing entire playlist.\nthis might take a little while depending on the length of the playlist");
			var playlist = await(youtube.getPlaylist(input));
			var list = await playlist.fetch();

			await queuePlaylist(guildAudioInfo, playlist);

			embed = createDiscordQueuePlaylistEmbed(list);
			break;

		// create entry from search result
		case "search":
			var url = await(searchYoutube(input));
			var entry = await(createMediaEntry(url));
			guildAudioInfo.queueAudioEntry(entry);
			embed = createDiscordQueueMediaEmbed(entry);
			break;

		// try to see if there is a valid url within the supplied input
		case "invalid":
			// attempt to extract video substring from user input
			// useful for when video is part of a playlist
			let match = input.match(ytVideoRegex);
			if (match != null) {
				// create entry if a valid URL is found
				try {
					entry = await(createMediaEntry(match));
				} catch(e) {
					throw e
				}
				guildAudioInfo.queueAudioEntry(entry);
				embed = createDiscordQueueMediaEmbed(entry);
			}
			throw new Error("invalid url provided")
			break;
	}
	return embed;
}

async function queuePlaylist(guildAudioInfo, playlist) {
	for (const video of playlist.videos) {
		entry = await(createMediaEntry(video.url));
		guildAudioInfo.queueAudioEntry(entry);
	};
}

async function searchYoutube(search) {
	let searchResults = await(youtube.searchOne(search));
	let url = ytVideoPrefix + searchResults.id;
	return url;
}

async function createMediaEntry(url) {
	if (!validYoutubeVideo) {
		throw new Error('invalid youtube url');
	}

	let video = await(youtube.getVideo(url));
	let entry = new guilds.AudioEntry(url, video.title, video.durationFormatted, video.channel.name);
	return entry;
}

// Gets the next playing video url from the supplied video url
async function getNextPlaying(url, guildInfo) {
	if (!validYoutubeVideo) {
		throw new Error('invalid youtube url');
	}

	let video = await(youtube.getVideo(url));
	let nextPlayingUrl = video.videos[0].url;

	return nextPlayingUrl;
}

// Creates a discord embed for showing the current queue
function createDiscordQueueEmbed(guildAudioInfo) {
	let queue = guildAudioInfo.queue;
	let nowPlaying = guildAudioInfo.nowPlaying;
	let currentIndex = guildAudioInfo.index;
	let queueEmbed = new MessageEmbed()
		.setColor('#ffc5f7')
		.setTitle('Current Queue')
		.setDescription('Listing current queue')
		.setTimestamp();

	let queueString = "";

	// nothing currently playing and nothing in queue
	if (queue.length == 0) {
		queueString = "Queue Empty";
	}
	else { 
		if (queue.length > 0) {
			for (var i = 0; i < queue.length; i++) {
				let rowString = "\n" + (i + 1);
				if (i == currentIndex) {
					rowString += ". **>** " + queue[i].title + " **<**\n";
				}
				else {
					rowString += ". " + queue[i].title + "\n";
				}
				queueString += rowString;
			}
		}
	}

	queueEmbed.addFields(
		{ name: 'Queue', value: queueString },
		{ name: '\u200B', value: '\u200B' },
	);

	return queueEmbed;
}

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

// Verify if a url is a valid youtube video
function validYoutubeVideo(url) {
	console.log(url);
	return ytVideoRegex.test(url);
}

