const winston = require("winston");

module.exports = {
	logDiscordMessage() {},
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
