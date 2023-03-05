// Require the necessary discord.js classes
const fs = require("fs");
const path = require("node:path");
const {
	Client,
	GatewayIntentBits,
	Collection,
	NewsChannel,
} = require("discord.js");
const { Player } = require("discord-player");
const { token } = require("./config.json");

// ========== BOT SETUP ========== //

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

// Load commands from command directory
const commandPrefix = "!";
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	let filePath = path.join(commandsPath, file);
	let command = require(filePath);
	// Check that potential command has the "execute" function
	if ("execute" in command) {
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		client.commands.set(command.name, command);
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}

// Setup discord player
const options = {
	filter: "audioonly",
	quality: "highestaudio",
	highWaterMark: 1 << 25,
};
const player = new Player(client, {
	ytdlOptions: options,
});

console.log("Mμse bot setup complete");

// ========== DISCORD PLAYER SETUP ========== //

// Handle player errors
player.events.on("error", (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the queue: ${error.message}`
	);
});

// Handle player connection errors
player.events.on("playerError", (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the connection: ${error.message}`
	);
});

player.events.on("playerStart", (queue, track) => {
	console.log(`now playing ${track.title}`);
	// queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
});

player.events.on("emptyQueue", (queue) => {
	console.log(queue.nowPlaying());
	console.log("queue has ended");
});

player.events.on("emptyChannel", (queue) => {
	queue.destroy(true);
	console.log("I'm all alone. disconnecting...");
});

// ========== BOT RUNTIME ========== //

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// Check new messages for command prefix and handle accordingly
client.on("messageCreate", async (message) => {
	if (message.content.startsWith(commandPrefix)) {
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

		var command = client.commands.get(cmd);
		if (command == null) {
			return message.reply("That is not a command.");
		}

		// execute the command
		command.execute(message, player);
	}
});

// Login to Discord with client token
client.login(token);
