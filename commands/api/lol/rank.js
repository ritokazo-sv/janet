require('dotenv').config();
const axios = require("axios")
const Discord = require("discord.js")
const { winrate } = require("../../../scripts/riot") 
const riot_token = process.env.RIOT_API

module.exports = {
    commands: ['elo', 'rank', 'r'],
    minArgs: 1,
    maxArgs: 999,
    expectedArgs: '<nome do jogador>',
    description: "Exibe informações do elo do Player ",
    callback: (message, arguments, text, client) => {

        // Concatena Parametrons em String
        const param = arguments.toString().replace(',', '+')

        // Busca Informações básicas do Player
        const endpoint = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${param}?api_key=${riot_token}`
        let embed = new Discord.MessageEmbed()

        axios.get(endpoint)
        .then((res) => {
            const player = res.data
            const iconAuthor = `https://ddragon.leagueoflegends.com/cdn/11.10.1/img/profileicon/${player.profileIconId}.png`
            const rankURL = `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player.id}?api_key=${riot_token}` 

            embed.setTitle('VEJA SEU PERFIL NO OP.GG')
            embed.setDescription('Você ainda não possui rank nessa season')
            embed.setAuthor(player.name, iconAuthor)
            embed.setThumbnail(iconAuthor)
            embed.setColor('7646FF')
            embed.setTimestamp()
            embed.setURL(`https://br.op.gg/summoner/userName=${param}`)
            embed.setFooter(`Solicitado por ${message.author.username}`)           

            axios.get(rankURL).then((response) => {
                
                if(response.data.length > 0) {
                    let desc = ''
                    response.data.forEach((rank) => {
                        desc += `\n\n **${rank.queueType}** \n`
                        desc += `> ${rank.tier} ${rank.rank}`
                        desc += `\n > ${rank.leaguePoints} PDL`
                        desc += `\n > ${rank.wins}V ${rank.losses}D (${winrate(rank.wins, rank.losses)}%)`
                    })

                    embed.setDescription(desc)
                }
                
                return message.channel.send(embed)

            }).catch((err) => {
                
                console.log(err)
                message.channel.send(embed)
            })
        })
        .catch((err) => { 
            if(err.response) {

                embed.setTitle(`Encontrei um erro`)
                embed.setAuthor(client.user.username, client.user.avatarURL())
                embed.setImage('https://cdn.god182.com/wp-content/uploads/2021/05/janet-feature.jpg')
                embed.setColor('7646FF')
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