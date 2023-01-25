module.exports = {
    name: "shuffle",
    async execute(message, player) {
        if (player == undefined) {
            message.reply("oopsie-doodle. something's gone terrible wrong");
            return;
        }
  
        let queue = player.getQueue(message.guild);
        if (queue != undefined) {
            queue.shuffle();
        } else {
            console.log("no queue to shuffle");
        }
    },
};

