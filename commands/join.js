module.exports = {
	name: "join",
	async execute(message, player) {
		if (player == undefined) {
			message.reply("oopsie-doodle. something's gone terrible wrong");
			return;
		}

		let queue = player.nodes.get(message.guild);
		if (queue == undefined) {
			queue = player.nodes.create({
				metadata: {
					channel: message.channel,
					client: message.guild.members.me,
					requestedBy: message.user,
				},
				selfDeaf: true,
				volume: 80,
				leaveOnEmpty: true,
				leaveOnEnd: false,
			});
		}

		// verify vc connection
		try {
			await queue.connect(message.member.voice.channel);
		} catch (e) {
			console.log(e.message);
			message.reply("oh no. I can't join the vc");
			queue.delete();
			return;
		}
	},
};
