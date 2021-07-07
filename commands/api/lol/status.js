require('dotenv').config();
const axios = require("axios")
const Discord = require("discord.js")
const { winrate } = require("../../../scripts/riot") 
const riot_token = process.env.RIOT_API

module.exports = {
    commands: ['lolstatus'],
    minArgs: 0,
    maxArgs: 0,
    description: "Exibe informações do servidor de LOL ",
    callback: (message, arguments, text, client) => {

        // Busca Informações básicas do Player
        const endpoint = `https://br1.api.riotgames.com/lol/status/v4/platform-data?api_key=${riot_token}`
        let embed = new Discord.MessageEmbed()

        axios.get(endpoint)
        .then((res) => {

            let status = ` O Servidor está em manutenção :red_circle:`

            if(res.data.maintenances && res.data.maintenances.maintenance_status !== 'in_progress') {
                status = `O Servidor está operando normalmente :green_circle:`
            }

            message.reply(status)

            console.log(res.data.incidents)

            embed.setTitle(status)
            embed.setDescription(status)
            embed.setAuthor(player.name, iconAuthor)
            embed.setThumbnail(iconAuthor)
            embed.setColor('random')
            embed.setTimestamp()
            embed.setURL(`https://br.op.gg/summoner/userName=${param}`)
            embed.setFooter(`Solicitado por ${message.author.username}`)         
              
        })
        .catch((err) => { 
            if(err.response) {
                embed.setTitle(`Encontrei um erro`)
                embed.setAuthor(client.user.username, client.user.avatarURL())
                embed.setImage('https://cdn.god182.com/wp-content/uploads/2021/05/janet-feature.jpg')
                embed.setColor('random')
                embed.setTimestamp()
                embed.setFooter(`Solicitado por ${message.author.username}`)

                let msg_error = `
                    A API da Riot notificou um erro **${err.response.statusText}** com o código **${err.response.status}** 
                    Estamos trabalhando para resolver isso.
                `

                if(err.response.status && err.response.status == 404) {
                    msg_error = `Jogador **${param}** não foi encontrado na Rito Gomes :smiling_face_with_tear:.`
                }

                embed.setDescription(msg_error)
                message.channel.send(embed) 
            }            
        })
    },
  }