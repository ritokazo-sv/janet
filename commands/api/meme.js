const Discord = require('discord.js')
const fetch = require("node-fetch");


module.exports = {
    commands: ['meme', 'sendmeme'],
    minArgs: 0,
    maxArgs: 1,
    description: "Tê dá um meme aleatório, ou envia para um amigo usando !sendmeme",
    callback: async (message, arguments, text, client) => {

        const reddit = 'cellbits'
        const endpoint = fetch(`https://www.reddit.com/r/${reddit}.json?limit=500&?sort=top&t=all`)
        const test = null

        endpoint.then(res => res.json())
        .then(json => json.data.children.filter(v => v.data.url.includes('png') || v.data.url.includes('jpg') || v.data.url.includes('jpeg') ||  v.data.url.includes('gif') ))
        .then((urls) => {
            const randomURL = urls[Math.floor(Math.random() * urls.length) + 1]
            
            // Envia mensagem Embed with image
            embed = new Discord.MessageEmbed()
            .setTitle(`${randomURL.data.title}`)
            .setURL(`${randomURL.data.url}`)
            .setImage(`${randomURL.data.url}`)
            .setColor('7646FF')
            .setTimestamp()
            .setFooter(`Solicitado por ${message.author.username}`)

            return message.channel.send(embed)

        })
        .catch((err) => {
            message.reply(`Houve um erro buscando seu meme ${err}`)
        })

    },
  }