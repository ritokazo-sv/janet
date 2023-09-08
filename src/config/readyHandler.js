const { REST, Routes } = require('discord.js');
const { loadCommands } = require('./commandLoader');
const path = require('path');

const commandFiles = path.join(__dirname, '..', 'commands');

async function handleReady(client) {
    console.log(`Logged in as ${client.user.tag}!`);

    const commands = loadCommands(commandFiles);

    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(client.token);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    handleReady
};