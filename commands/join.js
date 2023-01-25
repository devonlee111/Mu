module.exports = {
	name: "join",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.createQueue(message.guild);
				
		// verify vc connection
		try {
			await queue.connect(message.member.voice.channel);
		} catch(e) {
			console.log(e.message);
			message.reply("oh no. I can't join the vc");
			queue.destroy();
			return;
		}
    },
};
