const fs = require("fs");
const path = require('path');

const { EndBehaviorType } = require("@discordjs/voice");
const tools = require("../common/tools.js");
const { Worker } = require('worker_threads');
const waifu_engine = require("../AI/waifu_engine.js");

const { openAIAPIKey, elevenLabsAPIKey, elevenLabsVoiceID, prompt } = require("../AI/config.json");

const recordingDirectory = path.resolve(__dirname, "../../recordings");
const recordingFileExtension = "pcm";

const waifu = new waifu_engine.Waifu(elevenLabsVoiceID, prompt);
const recorder = new Worker(path.resolve(__dirname,'../recording/recording_worker.js'));

recorder.on('message', message => {
	if (message.error) {
		console.log(`error transcribing audio: ${message.error}`);
		return;
	}

	waifu.queueInput(message.user, message.mp3AudioFile);
});

module.exports = {
	name: "waifu",
	async execute(message) {
		if (!verifyAPIRequirements()) {
			message.reply("AI parameters not properly setup. Function not available at this time.");
			return;
		}

		console.log(recordingDirectory);
		if (!fs.existsSync(recordingDirectory)) {
			fs.mkdirSync(recordingDirectory);
		}

		await tools.ensureVoiceChannelConnection(message);
		let queue = tools.ensureGetQueue(message);
		let user = message.author.id;

		let recordingFile = `recording-${user}.${recordingFileExtension}`;
		let recordingFilePath = path.join(recordingDirectory, recordingFile);
	
		let stream = queue.voiceReceiver.recordUser(user, {
			mode: "pcm", // pcm or opus format
			end: EndBehaviorType.AfterSilence,
			silenceDuration: 1000,
		});
	
		let writer = stream.pipe(fs.createWriteStream(`${recordingFilePath}`));
		writer.once("finish", () => {
			stream.end();
	
			console.log(`recording of ${user} has been saved to ${recordingFile}`);
			console.log(`converting ${recordingFile} to mp3 format...`);
	
			recorder.postMessage({user: message.author.username, file: recordingFilePath, fileExtension: recordingFileExtension});
		});
	},
	
};

function verifyAPIRequirements() {
	let verified = true;
	
	if (openAIAPIKey == "") {
		verified = false;
		console.log ("openAI API Key not set")
	}

	if (elevenLabsAPIKey == "") {
		verified = false;
		console.log ("elevenlabs API Key not set")
	}

	if (elevenLabsVoiceID == "") {
		verified = false;
		console.log ("elevenLabs voice ID not set")
	}

	if (prompt == "") {
		verified = false;
		console.log ("AI prompt not set")
	}

	return verified;
}

console.log(waifu);
waifu.run();
