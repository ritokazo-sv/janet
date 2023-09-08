const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if(!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if(!commandObject) return;

        // Commands only for devs
        if(commandObject.devOnly) {
            if(!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Only developers are allowed to use this command.',
                    ephemeral: true,
                });

                return;
            }
        }

        // Test only
        if(commandObject.testOnly) {
            if(!interaction.guild.id === testServer) {
                interaction.reply({
                    content: 'This command cannot be ran here.',
                    ephemeral: true,
                });

                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'Not enough permissions.',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }
    
        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;
        
                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);

    } catch (error) {
        console.error(`There was a error running this command: ${error}`);
    }
};