const { testServer } = require('../../../config.json');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');

module.exports = async (client) => {    
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if(existingCommand) {
                if(localCommands.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    continue;
                }

                if(areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options
                    });

                    console.log(`Edited command "${name}"`);
                }
            } else {
                if(localCommand.deleted) {
                    console.log(`Skipping registering command "${name}" as it's set to delete.`);
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options
                });

                console.log(`Registered command "${name}"`);
            }
        }

    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
}