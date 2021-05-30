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

        axios.get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${arguments}?api_key=${riot_token}`)
        .then((res) => {
            const player = res.data
        })
        .catch((err) => { 
            if(err.response) {
                message.channel.send(`
                > A API da Riot notificou um erro **${err.response.statusText}** com o código **${err.response.status}** 
                \n > Estamos trabalhando para resolver isso.`) 
            }            
        })

        console.log(player)

        return

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