function GuildQueueEntry(guild) {
    this.guild = guild;
    this.queue = []; // index 0 = current song, index 1 = next song
    this.player = null;
    this.loop = false;
    this.loopAll = false;
}

var audioPlayer = module.exports = {
    guildQueues: [],
    guildQueueEntry: GuildQueueEntry,
}

