const Discord = require('discord.js')
const fetch = require("node-fetch");


module.exports = {
    commands: ['hot', 'sendhot', 'hots'],
    minArgs: 0,
    maxArgs: 1,
    ignore: true,
    description: "Tê dá uma sex pic random, ou envie para um amigo usando <prefix>sendhot",
    callback: async (message, arguments, text, client) => {

        const reddit = ['FamosasGostosas']
        const randreddit = reddit[Math.floor(Math.random() * reddit.length)]
        const end = `https://www.reddit.com/r/${randreddit}.json?limit=1000&?sort=top&t=all`
        const endpoint = fetch(end)

        const user = message.mentions.users.first()
        let dmuser = null 
        if(user) {
            dmuser = client.users.cache.get(user.id)
        }

        endpoint.then(res => res.json())
        .then(json => 
            json.data.children.filter(v => v.data.url.includes('png') || v.data.url.includes('jpg') || v.data.url.includes('jpeg')) 
        )
        .then((urls) => {
            console.log(urls.length)

            const randomURL = urls[Math.floor(Math.random() * urls.length) + 1]
            
            if(randomURL.data.title) {
            
                // Envia mensagem Embed with image
                embed = new Discord.MessageEmbed()
                .setTitle(`${randomURL.data.title}`)
                .setURL(`${randomURL.data.url}`)
                .setImage(`${randomURL.data.url}`)
                .setColor('7646FF')
                .setTimestamp()
                .setFooter(`Solicitado por ${message.author.username}`)

                if(dmuser) {
                    embed.setDescription(`${message.author.username} te enviou essa imagem`)
                    embed.setFooter(`Enviado por ${message.author.username}`)
                    message.channel.send(`> Imagem preparada e enviada para **${dmuser.username}**!`)
                    dmuser.send(embed)
                    return
                }

                return message.channel.send(embed)
            }

        })
        .catch((err) => {
            message.reply(`Houve um erro buscando seu meme ${err}`)
        })

    },
  }