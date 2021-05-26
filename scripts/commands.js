const { prefix } = require("../config.json");

module.exports = (client, aliases, callback) => {

    if(typeof aliases === 'string') {
        aliases = [aliases]
    }

    client.on('message', message => {
        const { content } = message;

        if(message.author.bot) return;

        aliases.forEach(alias => {            
            const args = content.slice(prefix.length).trim().split(' ');
            const comando = prefix+args.shift().toLowerCase();
            command = `${prefix}${alias}`;

            if((comando.startsWith(`$(command) `) || comando === command)) {
                console.log(`Running the command ${command}`);
                callback(message);
            }

        })
    })
}