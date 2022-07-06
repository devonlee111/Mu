module.exports = {
    name: "shuffleloop",
    async execute(guildInof, message) {
		guildInfo.audioInfo.shuffleLoop = !guildInfo.audioInfo.shuffleLoop;
		if (guildInfo.audioInfo.shuffleLoop) {
			message.reply("ok. will shuffle the queue on every loop");
		}
		else {	
			message.reply("no longer shuffling the queue on every loop");
		}
    }
};

