const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();

    // Loop through all the guilds the bot is in
    for (const guild of client.guilds.cache.values()) {
      console.log(`Checking commands for guild: ${guild.name}`);

      const applicationCommands = await getApplicationCommands(client, guild.id);

      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand;

        const existingCommand = applicationCommands.cache.find(cmd => cmd.name === name);

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.log(`🗑 Deleted command "${name}" in guild "${guild.name}".`);
            continue;
          }

          if (areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, { description, options });
            console.log(`🔁 Edited command "${name}" in guild "${guild.name}".`);
          }
        } else {
          if (localCommand.deleted) {
            console.log(`⏩ Skipping registering command "${name}" in guild "${guild.name}" as it's set to delete.`);
            continue;
          }

          await applicationCommands.create({ name, description, options });
          console.log(`👍 Registered command "${name}" in guild "${guild.name}".`);
        }
      }
    }
  } catch (error) {
      console.log(`There was an error: ${error}`);
  }
};