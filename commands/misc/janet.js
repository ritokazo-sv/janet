const Discord = require("discord.js")
const moment = require('moment')
const { formatDate } = require("../../scripts/custom")

module.exports = {
    commands: ['janet', 'j', 'botinfo'],
    minArgs: 0,
    maxArgs: 0,
    description: "Informações sobre a Janet",
    callback: (message, arguments, text, client, prefix) => {

        const inline = true
        const date = client.user.createdAt
        const userName = client.user.username
        const servsize = client.guilds.cache.size
        const usersize = client.user.usersize
        const status = {
            online: '`🟢` Online',
            offline: '`⚫` Offline'
        }
        let totalMembers = 0

        for(const guild of client.guilds.cache) {
            totalMembers += guild[1].memberCount
        }

        embed = new Discord.MessageEmbed()
        .setTitle(`Olá eu sou a Janet`)
        .setDescription(`Você pode conferir minhas funcionalidades digitando **${prefix}help**  \n\n [Adicione o Janet ao seu servidor](https://discord.com/oauth2/authorize?=&client_id=846768664572723250&scope=bot&permissions=8)`) 
        .setURL(`https://discord.com/oauth2/authorize?=&client_id=846768664572723250&scope=bot&permissions=8`)
        .setAuthor(`${client.user.username}`, client.user.avatarURL())
        .setColor('7646FF')
        .addField('**Meu nick**', userName)
        .addField('**Meu ID**', client.user.id)
        .addField('**Servidores**', `🛡 ${servsize}`, true)
        .addField('**Usuários**', `${totalMembers}`, inline)
        .addField('**Estou online a**', moment().to(client.startTime, true))
        .addField('**Criado em**', formatDate('DD/MM/YYYY, às HH:mm:ss', date))
        .addField('**Author**', '@godbr')
        .setFooter(`2021 © ${client.user.username}.`)

        if (client.user.presence.status) {
            embed.addField(
              '**Status**',
              `${status[client.user.presence.status]}`,
              inline,
              true
            )
          }

        return message.channel.send(embed)
    },
  }