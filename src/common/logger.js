const winston = require("winston");
const fs = require("fs");

const MUSE_LOG_DIR = "/var/log/muse/";
const DISCORD_MESSAGES_LOG_SUBDIR = "discord_messages/";
const DISCORD_MESSAGES_LOG_FILE = "messages.log";

module.exports = {
	setupLoggingDir() {
		if (!fs.existsSync(MUSE_LOG_DIR)) {
			fs.mkdirSync(MUSE_LOG_DIR);
		}

		if (!fs.existsSync(`${MUSE_LOG_DIR}${DISCORD_MESSAGES_LOG_SUBDIR}`)) {
			fs.mkdirSync(`${MUSE_LOG_DIR}${DISCORD_MESSAGES_LOG_SUBDIR}`);
		}
	},
	logDiscordMessage(message) {
		channel = message.channelId;
		logMsg = `${message.createdAt.toString()}: ${message.author.username}: ${
			message.content
		}`;
		log_file = `${MUSE_LOG_DIR}${DISCORD_MESSAGES_LOG_SUBDIR}${channel}${DISCORD_MESSAGES_LOG_FILE}`;
		try {
			fs.writeFileSync(log_file, logMsg);
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