module.exports = {
    name: "loopq",
    async execute(guildInof, message) {
		let audioInfo = guildInfo.audioInfo;

		let loopType = "all";
		if (audioInfo.loopType == loopType) {
			loopType = "none";
		}

		audioInfo.changeLoopType(loopType);
		console.log(loopType);
    }
};

