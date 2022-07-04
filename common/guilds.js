function GuildInfo() {
	this.audioInfo = new GuildAudioInfo();
}

function GuildAudioInfo() {
	this.subscription = null;
	this.nowPlaying = null;
	this.index = 0;
	this.queue = [];
	this.loopType = "none";
	this.autoplay = false;

	this.reset = function() {
		this.subscription = null;
		this.nowPlaying = null;
		this.index = 0;
		this.queue = [];
		this.loopType = "none";
		this.autoplay = false;
	}

	// Add new entry to queue
	// Set now playing to new entry if emtpy
	this.queueAudioEntry = function(entry) {
		this.queue.push(entry);
	}

	// Cycle to next entry in the queue
	this.cycleQueue = function(entry) {
		switch (this.loopType) {
			// no looping, just get next audio
			case "none":
				let lastPlaying = this.nowPlaying;
				if (this.nowPlaying == null) {
					// nothing playing, just set first element in queue to now playing
					if (this.queue.length > 0) {
						this.nowPlaying = this.queue[0];
					}
				}
				else {
					// something is playing, shift the queue and set now playing to first element
					this.queue.shift();
					this.nowPlaying = this.queue[0];
				}

				if (this.nowPlaying == undefined) {
					// reset state if nothing left in queue and not autoplaying
					this.nowPlaying = null;
				}
				break;

			// replay media, no need to alter anything	
			case "one":
				if (this.nowPlaying == null) {
					if (this.queue.length > 0) {
						this.nowPlaying = this.queue[0];
					}
				}
				break;

			// use index to get next playing
			// shift index to next element and set that as nowPlayuing
			// wrap around to beginning if reached the end
			case "all":
				// Check if nowPlaying is null
				// Should only happen when items added to queue and not yet cycled
				if (this.nowPlaying == null) {
					if (this.queue.length > 0) {
						this.nowPlaying = this.queue[this.index];
					}
					else {
						return;
					}
				}
				this.index++;
				// check if it has reached the end of queue and wrap around
				if (this.index >= this.queue.length) {
					this.index = 0;
				}
				this.nowPlaying = this.queue[this.index];
				break;

			// reset loopType if it is not recognized and cycle to next audio
			default:
				this.loopType = "none";
				this.cycleQueue();
				break;
		}
	}

	// resets the index back to default (0)
	// removes all played entries (queue[<index])
	// element 0 will be what was pointed to by index before
	// used for freeing space for loop type other than all
	this.resetQueueIndex = function() {
		this.queue = this.queue.splice(this.index + 1);
		this.index = 0;
	}

	// clears queue entirely and resets index
	this.clearQueue = function() {
		this.queue = [];
		this.index = 0;
		this.nowPlaying = null;
	}

	// changes loop type
	// resets index as required
	this.changeLoopType = function(loopType) {
		switch (loopType) {
			case "none":
				this.loopType = "none";
				if (this.index != 0) {
					this.resetQueueIndex()
				}
				break;

			case "one":
				this.loopType = "one"
					if (this.index != 0) {
						this.resetQueueIndex()
					}
				break;

			case "all":
				this.loopType = "all";
				break;

			default:
				break;
		}
	}
}

function AudioEntry(url, title, duration, channel) {
	this.url = url;
	this.title = title;
	this.duration = duration;
	this.channel = channel;
}

module.exports = { GuildInfo, GuildAudioInfo, AudioEntry };

