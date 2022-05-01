module.exports = {
   	name: "clear",
    async execute(guildInfo, message) {
		guildInfo.audioInfo.clearQueue();
    }
};

