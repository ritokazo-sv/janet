const fs           = require('fs');
const path         = require('path');
const commandPaths = {};

function loadCommands(dir) {
    const commands = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const folderCommands = loadCommands(filePath, commandPaths);
            commands.push(...folderCommands);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            commands.push(command.data.toJSON());
            commandPaths[command.data.name] = filePath;
        }
    }
    return commands;
}

module.exports = {
    loadCommands,
    commandPaths,
};