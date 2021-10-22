const { SlashCommandBuilder } = require('@discordjs/builders');
const audioPlayer = require('../audioPlayer.js');
const playdl = require('play-dl');
const wait = require('util').promisify(setTimeout);
const searchOptions = {
    limit : 1
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Queue a song to play.')
        .addStringOption(option => option.setName('song').setDescription('Enter a string')),
    async execute(interaction, message) {
        let toPlay = null;
        if (interaction == null) {
            if (message == null) {
                // should not happen
                console.log('no interaction or message provided');
                return
            }
            content = message.content.trim();
            if (content != "") {
                toPlay = content;
            }
            interaction = message;
        }
        else {
            toPlay = interaction.options.getString('song');
        }
 
        let guild = interaction.guildId;
        // List out queue if no song specified
        if (toPlay == null) {
            // Check that guildQueue exists
            if (!audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                let channel = await interaction.client.channels.fetch(interaction.channelId);
                return 'No songs in queue.'
            }

            let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
            guildQueue = audioPlayer.guildQueues[guildIndex].queue;
            if (guildQueue.length == 0) { 
                return 'There are no songs in queue.'
            }
          
			await interaction.reply("Ok. One moment while I get that for you...")
  
            let reply = "";
            for (let i = 0; i < guildQueue.length; i++) {
				let entry = guildQueue[i]
				if (entry == "") {
					continue
				}	
				let video = await playdl.video_basic_info(guildQueue[i]);
				let title = video.video_details.title;
				if (reply == "") {
					reply = title;
				}
				else {
                	reply = reply + "\n" + title;
				}
            }
            interaction.channel.send(`Here's what I got:\n\`${reply}\``);
			return null
        }
        else {
            let validURL = playdl.yt_validate(toPlay);
            if (!validURL) {
                let searchResults = await playdl.search(toPlay, searchOptions);
                toPlay = searchResults[0].url;
            }
            else if (validURL === "playlist") {
                return "I cannot play playists.";
            }

			let video = await playdl.video_basic_info(toPlay);
			let title = video.video_details.title;

            // Check if guild exists in guildQueues
            if (audioPlayer.guildQueues.some(guildQueue => guildQueue.guild == guild)) {
                let guildIndex = audioPlayer.guildQueues.findIndex((guildQueue => guildQueue.guild == guild));
                audioPlayer.guildQueues[guildIndex].queue.push(toPlay);
            }
            else {
                // Create new guildQueue and set queue
                let entry = new audioPlayer.guildQueueEntry(guild);
                entry.queue = [ "", toPlay ]
                audioPlayer.guildQueues.push(entry);
            }
            return `I have added \`${title}\` has been added to the queue.`;
        }
    },
};

