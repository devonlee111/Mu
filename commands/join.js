const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = {
	name: "join",
	async execute(guildInfo, message) {
		let guildID = message.guildId;
        let channel = message.member.voice.channel;
		let connection = undefined;
		try {
			connection = joinChannel(channel);
			guildInfo.audioInfo.connection = connection;
		} catch(e) {
			message.reply("failed to join voice channel: " + e.message);
		}
    },
	joinChannel,
};

function joinChannel(channel) {
	if (channel == null) {
		throw new Error("user not connected to a voice channel.");
	} 
	
	let connection = joinVoiceChannel({
    	channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});

	connection.on('stateChange', (oldState, newState) => {
		console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
	});

	return connection;
}

