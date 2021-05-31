const axios = require("axios")
const Discord = require("discord.js")

module.exports = {
    commands: ['cat', 'gato', 'sendcat'],
    minArgs: 0,
    maxArgs: 1,
    description: "Exibe gatos aleatórios, utilize <prefix>sendcat <@username> para enviar para amigos na DM ",
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
            .setTitle(`Veja no seu Navegador`)
            .setURL(`${res.data[0].url}`)
            .setImage(`${res.data[0].url}`)
            .setColor('7646FF')
            .setTimestamp()
            .setFooter(`Solicitado por ${message.author.username}`)

            if(dmuser) {
                embed.setDescription(`${message.author.username} te enviou esse pacote`)
                embed.setFooter(`Enviado por ${message.author.username}`)
                message.channel.send(`> Gato embalado e despachado para **${dmuser.username}**!`)
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