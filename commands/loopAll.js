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

		switch(audioInfo.loopType) {
			case "one":
				message.reply("now looping current audio");
				break;

			case "all":
				message.reply("now looping entire queue");
				break;

			case "none":
				message.reply("no longer looping");
				break;
		}
    }
};

