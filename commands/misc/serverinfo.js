const Discord = require("discord.js")

module.exports = {
    commands: ['serverinfo', 'servers'],
    minArgs: 0,
    maxArgs: 0,
    description: "Veja informações do seu servidor no Discord",
    callback: (message, arguments, text, client) => {
        
        client.guilds.cache.forEach((guild) => {

            if(guild.id == message.guild.id) {
      
              const { name, region, memberCount, owner, afkTimeout } = guild
      
              embed = new Discord.MessageEmbed()
              .setTitle(`${guild.name}`)
              .setDescription(`Tem o total de ${guild.memberCount} membros`) 
              .addFields(
                {
                  name: 'Região',
                  value:  region,
                },
                {
                  name: 'Membros',
                  value:  memberCount,
                },
              )
              .setThumbnail(guild.iconURL())
              .setTimestamp()
              .setFooter(`Solicitado por ${message.author.username}`)
      
              message.channel.send(embed)
            }
          })
    },
  }