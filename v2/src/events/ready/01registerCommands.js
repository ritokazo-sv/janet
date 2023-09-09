const { testServer } = require('../../../config.json');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');

module.exports = async (client) => {    
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (appCommand of applicationCommands) {
            console.log(`Checking commands for "${appCommand.guild.name}"`);

            for (const localCommand of localCommands) {
                const { name, description, options } = localCommand;
    
                const existingCommand = await appCommand.cache.find(
                    (cmd) => cmd.name === name
                );
    
                if(existingCommand) {
                    if(localCommands.deleted) {
                        await appCommand.delete(existingCommand.id);
                        continue;
                    }
    
                    if(areCommandsDifferent(existingCommand, localCommand)) {
                        await appCommand.edit(existingCommand.id, {
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
    
                    await appCommand.create({
                        name,
                        description,
                        options
                    });
    
                    console.log(`Registered command "${name}"`);
                }
            }
        }
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
}