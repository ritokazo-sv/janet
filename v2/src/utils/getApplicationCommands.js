module.exports = async (client, guilds = []) => {
    let applicationCommands = [];

    if(guilds) {
        for(const appCommands of guilds) {
            let guild = await client.guilds.fetch(appCommands);
            applicationCommands.push(guild.commands);
            await guild.fetch();            
        }
        
    }else {
        applicationCommands = await client;
        await applicationCommands.fetch();
    }
    
    return applicationCommands;
}