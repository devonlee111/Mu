module.exports = {
	async ensureVoiceChannelConnection(queue, message) {
		if (queue.connection == undefined) {
			try {
				await queue.connect(message.member.voice.channel);
			} catch (e) {
				console.log(e.message);
				message.reply("oh no. I can't join the vc");
				queue.delete();
				return false;
			}
		}
		return true;
	},
	ensureGetQueue(player, message) {
		player.nodes.get(message.guild);
		if (queue == undefined) {
			queue = createQueue(player, message);
		} else {
			queue = player.nodes.get(message.guild);
		}
		return queue;
	},
};

function createQueue(player, message) {
	queue = player.nodes.create(message.guild, {
		metadata: {
			channel: message.channel,
			client: message.guild.members.me,
			requestedBy: message.author,
		},
		selfDeaf: true,
		volume: 80,
		leaveOnEmpty: true,
		leaveOnEnd: false,
	});
	return queue;
}
