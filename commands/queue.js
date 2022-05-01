const wait = require('util').promisify(setTimeout);
const youtube = require('youtube-sr').default;

// Regex for verifying/finding youtube video in input
const ytVideoRegex = /https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_]{11}/;
const ytPlaylistRegex = /https:\/\/www\.youtube\.com\/playlist\?list=/;
const linkPrefix = "https://";
const ytVideoPrefix = "https://www.youtube.com\/watch\?v=";

const guilds = require('../common/guilds.js')

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
			let queue = guildAudioInfo.queue;
			for (var i = 0; i < queue.length; i++) {
				console.log(queue[i].title);
			}
			if (guildAudioInfo.nowPlaying != null) {
				console.log("now playing\n" + guildAudioInfo.nowPlaying.title);
			}
			// TODO format queue string and return
			return;
		}
		// Queue the given media
		else {
			queueAudio(guildAudioInfo, toQueue)
		}
	},
	queueAudio,
};

async function queueAudio(guildAudioInfo, input) {
	let entry;
	entry = await(processUserInput(input));
	if (entry == null) {
		return;
	}
	guildAudioInfo.queueAudioEntry(entry);
}

// check what type of input user provided (search, video url, playlist url, invalid url)
// attempt to make a media entry out of provided input
async function processUserInput(input) {
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

	switch (inputType) {
		// create entry directly from supplied video URL
		case "video":
			entry = await(createMediaEntry(input));
			return entry;
			break;

		case "playlist":
			// can't queue playlist
			// TODO allow queueing of every video in playlist
			return null;
			break;

		// create entry from search result
		case "search":
			url = await(searchYoutube(input));
			entry = await(createMediaEntry(url));
			return entry;
			break;

		// try to see if there is a valid url within the supplied input
		case "invalid":
			// attempt to extract video substring from user input
			// useful for when video is part of a playlist
			match = input.match(ytVideoRegex);
			if (match != null) {
				// create entry if a valid URL is found
				entry = await(createMediaEntry(match));
				return entry;
			}

			return null;
			break;
	}
}

async function searchYoutube(search) {
	let searchResults = await(youtube.searchOne(search));
	url = ytVideoPrefix + searchResults.id;
	return url;
}

async function createMediaEntry(url) {
	if (!validYoutubeVideo) {
		// throw new Error('invalid video');
		return
	}

	video = await(youtube.getVideo(url));
	entry = new guilds.AudioEntry(url, video.title, video.durationFormatted, video.channel.name);
	return entry;
}

function validYoutubeVideo(url) {
	return ytVideoRegex.test(url)
}

