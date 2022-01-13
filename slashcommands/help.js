const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help using Mμse.'),
    async execute(interaction, message) {
        if (interaction == null) {
            if (message == null) {
                // Should not happen
                console.log('no interaction or message provided');
                return
            }
        interaction = message;
        }
        return 'WIP';
    }
};

