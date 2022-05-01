const play = require('./play.js');

module.exports = {
    name: "skip",
    async execute(guildInfo, message) {
		play.playNext(guildInfo.audioInfo);
    }
};

