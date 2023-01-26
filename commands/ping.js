module.exports = {
    name: "ping",
    async execute(message) {
        let now = new Date();
        let lagTime = (now - message.createdAt);
        message.reply("Pong! " + "`" + lagTime + "ms`");
    },
};
