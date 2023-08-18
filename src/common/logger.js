const winston = require("winston");
const fs = require("fs");

const MUSE_LOG_DIR = "/var/log/muse/";
const DISCORD_MESSAGES_LOG_SUBDIR = "discord_messages/";
const DISCORD_MESSAGES_LOG_FILE = "messages.log";

module.exports = {
	logDiscordMessage(message) {
		channel = message.channelId;
		logMsg = `${message.createdAt.toString()}| ${message.author.username}: ${
			message.content
		}\n`;
		logFileDir = `${MUSE_LOG_DIR}${DISCORD_MESSAGES_LOG_SUBDIR}${channel}`;
		logFile = `${MUSE_LOG_DIR}${DISCORD_MESSAGES_LOG_SUBDIR}${channel}/${DISCORD_MESSAGES_LOG_FILE}`;

		if (!fs.existsSync(logFileDir)) {
			fs.mkdir(logFileDir, (err) => {
				console.log(
					"failed to create new directory for discord message logging: ",
					err
				);
				return;
			});
		}

		try {
			fs.appendFileSync(logFile, logMsg);
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
