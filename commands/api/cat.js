const axios = require("axios")
const Discord = require("discord.js")

module.exports = {
    commands: ['cat', 'gato', 'sendcat'],
    minArgs: 0,
    maxArgs: 1,
    description: "Exibe gatos aleatórios, utilize !sendcat <@username> para enviar para amigos na DM ",
    callback: (message, arguments, text, client) => {
        const { guild, channel } = message

        const user = message.mentions.users.first()
        let dmuser = null 
        if(user) {
            dmuser = client.users.cache.get(user.id)
        }

        axios.get('https://api.thecatapi.com/v1/images/search')
        .then((res) => {            

            // Envia mensagem Embed with image
            embed = new Discord.MessageEmbed()
            .setTitle(`Veja online`)
            .setURL(`${res.data[0].url}`)
            .setImage(`${res.data[0].url}`)
            .setColor('7646FF')
            .setTimestamp()
            .setFooter(`Solicitado por ${message.author.username}`)

            if(dmuser) {
                message.channel.send(`> Gato despachado e embalado para **${dmuser.username}**!`)
                dmuser.send(embed)
                return
            }
            
            message.channel.send(embed)
        })
        .catch((err) => {
            console.error('ERR:', err)
        })
    },
  }