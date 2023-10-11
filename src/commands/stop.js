const tools = require("../common/tools.js");

module.exports = {
	name: "stop",
	async execute(message) {
		let queue = tools.ensureGetQueue(message);

		queue.delete();
		return;
	},
};
