const { EmbedBuilder } = require('discord.js');

module.exports = {
    // Creates a discord embed for showing the current queue
    createDiscordQueueEmbed(queue) {
        nowPlaying = undefined;
        if (queue.playing) {
            nowPlaying = queue.nowPlaying();
        }
        let queueEmbed = new EmbedBuilder()
            .setColor('#ffc5f7')
            .setTitle('Current Queue')
            .setDescription('Listing current queue')
            .setTimestamp();

        let queueString = "";

        // nothing currently playing and nothing in queue
        if (queue.tracks.length == 0) {
            queueString = "Queue Empty";
        }
        else { 
            if (nowPlaying) {
                queueString = "**>** " + nowPlaying.title + " **<**\n";
            }
            for (var i = 0; i < queue.tracks.length; i++) {
                let rowString = "\n" + (i + 1) + ". " + queue.tracks[i].title + "\n";
                queueString += rowString;
            }
        }

        queueEmbed.addFields(
            { name: 'Queue', value: queueString },
            { name: '\u200B', value: '\u200B' },
        );

        return queueEmbed;
    },
    // Creates a discord embed for queueing a specific media entry
    createDiscordQueueMediaEmbed(track) {
        let entryEmbed = new EmbedBuilder()
            .setColor('#ffc5f7')
            .setTitle('Media Queued')
            .setDescription('Queueing requested media')
            .addFields(
                { name: 'Title', value: track.title, inline: true },
                { name: 'Uploader', value: track.author, inline: true },
                { name: 'Duration', value: track.duration, inline: true },
                { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter({ text: track.url });

        return entryEmbed;
    },
    // Creates a discord embed for queueing an entire playlist
    createDiscordQueuePlaylistEmbed(playlist) {
        var playlistEmbed = new EmbedBuilder()
            .setColor('#ffc5f7')
            .setTitle('Playlist Queued')
            .setDescription('Queueing requested playlist')
            .addFields(
                { name: 'Title', value: playlist.title, inline: true },
                { name: 'Length', value: playlist.tracks.length.toString(), inline: true },
                { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter({ text: playlist.url });

        return playlistEmbed;
    },
}