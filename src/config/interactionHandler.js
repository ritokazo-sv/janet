const commandPaths = require('./commandLoader').commandPaths;

async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    try {
        const commandFilePath = commandPaths[commandName];
        if (!commandFilePath) return;

        const command = require(commandFilePath);

        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
    }
}

module.exports = {
    handleInteraction
};