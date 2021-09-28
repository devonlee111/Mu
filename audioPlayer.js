function GuildQueueEntry(guild) {
    this.guild = guild;
    this.queue = [];
    this.player = null;
    this.currentSong = "";
    this.loop = false;
    this.loopAll = false;
}

var audioPlayer = module.exports = {
    guildQueues: [],
    guildQueueEntry: GuildQueueEntry,
}

