module.exports = {
	name: "loop",
    async execute(guildInfo, message) {
		let audioInfo = guildInfo.audioInfo;

		let loopType = "one";
		if (audioInfo.loopType == loopType) {
			loopType = "none";
		}

		audioInfo.changeLoopType(loopType);
		console.log(loopType);
    }
};

