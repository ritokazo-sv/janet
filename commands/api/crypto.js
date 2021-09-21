require('dotenv').config();
const Discord = require("discord.js")
const request = require('request');
const { status } = require("../../scripts/music")

module.exports = {
    commands: ['valor'],
    minArgs: 1,
    maxArgs: 999,
    expectedArgs: '<simbolo moeda>',
    description: "Exibe informações sobre o valor da moeda solicitada ",
    callback: (message, arguments, text, client) => {

        // Concatena Parametrons em String
        let param = arguments.toString().split(',').join('+').toUpperCase()

        const options = {
            url: 'https://api.livecoinwatch.com/coins/single',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': 'bb222a9e-563a-4cc3-8eba-4b817d2c0443'
            },
            body: JSON.stringify({
                currency: 'BRL',
                code: param,
                meta: true
            })
        };
        
        request(options, function(err, res, body) {
            let json = JSON.parse(body);

            if(json.error) {
                // Envia mensagem Embed with image
                embed = new Discord.MessageEmbed()
                .setTitle(`Moeda não encontrada.`)
                .setColor('random')
                .setTimestamp()

                return message.reply(embed)
            }

            let value = json.rate.toFixed([2])

            // Envia mensagem Embed with image
            embed = new Discord.MessageEmbed()
            .setTitle(`${json.name}`)
            .addField('**Preço Atual**', `R$ ${value}`)
            .setColor(`${json.color}`)
            .setTimestamp()
            .setThumbnail(`${json.png64}`)

            status(client, ` ${param} R$ ${value}`)

            message.reply(embed)
        });
        
    },
  }