const winston = require("winston");
const fs = require("fs");

const DISCORD_MESSAGE_LOG_FILE = "/var/log/muse/message.log";

module.exports = {
	logDiscordMessage(message) {
		logMsg =
			message.createdAt.toString() +
			": " +
			message.author.username +
			": " +
			message.content;
		try {
			fs.writeFile(DISCORD_MESSAGE_LOG_FILE, logMsg);
		} catch (err) {
			console.log(err);
		}
	},
	logDiscordCommand() {},
	writeErrorLog() {},
	writeWarnLog() {},
	writeInfoLog() {},
	writeDebugLog() {},
	setLogLevel() {},
};

function createNewLogger(logLevel, logFile) {
	logger = winston.createLogger({
		level: logLevel,
		format: winston.format.json(),
		defaultMeta: { service: "user-service" },
		transports: [new winston.transports.File({ filename: logFile })],
	});

	return logger;
}
