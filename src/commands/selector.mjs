import { clear } from "./clear.mjs";
import { disconnect } from "./disconnect.mjs";
import { join } from "./join.mjs";
import { loop } from "./loop.mjs";
import { loopAll } from "./loopAll.mjs";
import { pause } from "./pause.mjs";
import { ping } from "./ping.mjs";
import { play } from "./play.mjs";
import { playNext } from "./playNext.mjs";
import { playNow } from "./playNow.mjs";
import { queue } from "./queue.mjs";
import { roll } from "./roll.mjs";
import { shuffle } from "./shuffle.mjs";
import { skip } from "./skip.mjs";
import { stop } from "./stop.mjs";


export async function runCommand(command, message) {
	switch (command) {
		case "clear":
			clear(message);
			break;
		case "disconnect":
			disconnect(message);
			break;
		case "join":
			join(message);
			break;
		case "loop":
			loop(message);
			break;
		case "loopall":
			loopAll(message);
			break;
		case "pause":
			pause(message);
			break;
		case "ping":
			ping(message);
			break;
		case "play":
			play(message);
			break;
		case "playnext":
			playNext(message);
			break;
		case "playnow":
			playNow(message);
			break;
		case "queue":
			queue(message);
			break;
		case "roll":
			roll(message);
			break;
		case "shuffle":
			shuffle(message);
			break;
		case "skip":
			skip(message);
			break;
		case "stop":
			stop(message);
			break;
	}
}