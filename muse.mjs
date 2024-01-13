// Require the necessary discord.js classes
import { readFileSync } from 'fs';

import { Client, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";

import { runCommand } from './src/commands/selector.mjs';

// ========== BOT SETUP ========== //
let config = JSON.parse(readFileSync('./config.json', 'utf8'));

const token = config.token;
const prefix = config.prefix;
const ytCookie = config.ytCookie;

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
});

// Setup discord player
const player = new Player(client, {
	ytdlOptions: {
		requestOptions: {
			headers: {
				cookie: ytCookie,
			},
		}
	}
});

player.extractors.loadDefault((ext) => ext == "YouTubeExtractor");

console.log("Mμse bot setup complete");

// ========== DISCORD PLAYER SETUP ========== //

// Handle player errors
player.events.on("error", (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the queue: ${error.message}`
	);
});

// Handle player connection errors
player.events.on("playerError", (queue, error, track) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the connection: ${error.message}`
	);
});

player.events.on("playerStart", (queue, track) => {
	console.log(`now playing ${track.title}`);
	// queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
});

player.events.on("playerSkip", (queue, track) => {
	console.log(`player has skipped ${track.title}`);
});

player.events.on("emptyQueue", (queue) => {
	console.log("queue has ended");
});

player.events.on("emptyChannel", (queue) => {
	console.log("I'm all alone. disconnecting...");
});

player.events.on("debug", (queue, debugMessage) => {
	console.log(debugMessage);
});

// ========== BOT RUNTIME ========== //

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// Check new messages for command prefix and handle accordingly
client.on("messageCreate", async (message) => {
	if (message.content.startsWith(prefix)) {
		console.log("detected command: " + message.content);
		// Parse out given command
		var content = message.content.substring(1);
		var spaceIndex = content.indexOf(" ");
		var cmd = "";
		if (spaceIndex != -1) {
			cmd = content.substring(0, spaceIndex);
			message.content = content.substring(spaceIndex + 1);
		} else {
			cmd = content;
			message.content = "";
		}

		cmd = cmd.toLowerCase();

		runCommand(cmd, message);
	}
});

// Login to Discord with client token
client.login(token);
