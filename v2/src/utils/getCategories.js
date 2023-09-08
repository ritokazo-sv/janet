const allCommands = require('./getLocalCommands');

module.exports = (formated = false) => {
    const commands = allCommands();

    const groupedCommands = {};

    // Group categories
    for (const command of commands) {
        if(command) {
            if (!groupedCommands[command.category]) {
                groupedCommands[command.category] = [];
            }
            groupedCommands[command.category].push(command);
        }        
    }

    // return for options
    if(formated) {
        const formattedChoices = Object.keys(groupedCommands).map(category => {
            return {
                name: category,
                value: category,
            };
        });

        return formattedChoices;
    }

    return groupedCommands;
};