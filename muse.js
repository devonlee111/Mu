// Require the necessary discord.js classes
const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const player = require('./audioPlayer.js')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
   	client.commands.set(command.data.name, command);
}

const prefix = '!'

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    var command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        let reply = await command.execute(interaction, null);
		if (reply != null) {
        	return interaction.reply(reply);
		}
    } catch (error) {
        console.log(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.content.startsWith(prefix)) {
        var content = message.content.substring(1);
        var spaceIndex = content.indexOf(" ");
        var cmd = "";
        if (spaceIndex != -1) {
            cmd = content.substring(0, spaceIndex);
            message.content = content.substring(spaceIndex + 1);
        }
        else {
            cmd = content;
            message.content = '';
        }

        cmd = cmd.toLowerCase();
        
        var command = client.commands.get(cmd);
        if (command == null) {
            return message.reply('That is not a command.');
        }

        let reply = await command.execute(null, message)
		if (reply != null) {
        	return message.reply(reply);
		}
    }
});


// Login to Discord with client token
client.login(token);

