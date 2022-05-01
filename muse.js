// Require the necessary discord.js classes
const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const guilds = require('./common/guilds.js')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
   	client.commands.set(command.name, command);
}

const prefix = '!'
const guildMap = new Map();

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Check new messages for command prefix and handle accordingly
client.on('messageCreate', async message => {
    if (message.content.startsWith(prefix)) {
		var guildID = message.guildId;
		if (!isKnownGuild(guildID)) {
			console.log("unknown guild: adding to known guilds");
			addGuildToMap(guildID);
		}

        var content = message.content.substring(1);
        var spaceIndex = content.indexOf(" ");
        var cmd = "";
        if (spaceIndex != -1) {
            cmd = content.substring(0, spaceIndex);
            message.content = content.substring(spaceIndex + 1);
        }
        else {
            cmd = content;
            message.content = "";
        }

        cmd = cmd.toLowerCase();
        
        var command = client.commands.get(cmd);
        if (command == null) {
            return message.reply('That is not a command.');
        }

		guildInfo = guildMap.get(guildID);
	    command.execute(guildInfo, message)
    }
});

function isKnownGuild(guildID) {
	return guildMap.has(guildID);
}

function addGuildToMap(guildID) {
	guildEntry = new guilds.GuildInfo();
	guildMap.set(guildID, guildEntry);	
}

// Login to Discord with client token
client.login(token);

