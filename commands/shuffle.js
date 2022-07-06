module.exports = {
    name: "shuffle",
    async execute(guildInfo, message) {
		guildInfo.audioInfo.shuffleQueue();
		message.reply("the queue has been shuffled.");
    },
};

