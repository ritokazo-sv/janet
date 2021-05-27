require('dotenv').config();

const Discord = require("discord.js")
const { options } = require("./config.json")
const command = require('./scripts/commands')
const music = require("./scripts/music.js")
const path = require('path')
const fs = require('fs')
const token = process.env.DISCORD_TOKEN
const client = new Discord.Client()

client.on('ready', async () => {
  console.log("Janet is Online baby!")

  const baseFile = 'command-base.js'
  const commandBase = require(`./commands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(option)
      }
    }
  }

  readCommands('commands')

  commandBase.listen(client)
})

client.login(token)

return
client.once("ready", () => {
  // Oh Janet!
  console.log("Janet is Online baby!")

  // Seta o Status do Bot
  music.status(client, ' the office no vazio')
  
  // Lista Comandos do Bot
  command(client, ['help', 'ajuda'], (message) => {
    embed = new Discord.MessageEmbed()
    .setTitle(`Lista de Comandos da Janet`)
    .setDescription(`${options.join("\n")}`) 
    .setThumbnail('https://pbs.twimg.com/profile_images/911621253764603904/DXiJWgyl_400x400.jpg')
    .setTimestamp()
    .setFooter(`Solicitado por ${message.author.username}`)

    return message.channel.send(embed)
  })

  // Lista Comandos do Bot
  command(client, ['janet'], (message) => {
    embed = new Discord.MessageEmbed()
    .setTitle(`Adicione a Janet no seu Servidor`)
    .setDescription(`Utilize o link: https://shorturl.at/akvKW`) 
    .setURL(`https://shorturl.at/akvKW`)
    .setThumbnail('https://pbs.twimg.com/profile_images/911621253764603904/DXiJWgyl_400x400.jpg')
    .setTimestamp()
    .setFooter(`Solicitado por ${message.author.username}`)

    return message.channel.send(embed)
  })

  // Lista de Membros do Servidor
  command(client, ['membros', 'info'], (message) => {

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
  })

  // Limpa Mensagens do Canal
  command(client, ['cc', 'clearchannel'], (message) => {
    if(message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.messages.fetch().then(results => {
        message.channel.bulkDelete(results)
      })
    }
  })

  // Start Music Bot
  // Comando para Escolher a música do youtube
  command(client, 'play', (message) => {
    music.status(client, ' umas músicas doidas', 2)
    music.ysearch(message)
  })

  // Comando para Listar Músicas na Fila
  command(client, 'playlist', (message) => {
    music.list(message)
  })

  // Comando para pular de Música
  command(client, 'skip', (message) => {
    music.skip(message)
  })

  // Comando para Parar a Janet
  command(client, 'stop', (message) => {
    music.stop(message)
    music.status(client, ' tibia no vazio', 0)
  })
  // End Music Bot

})

client.login(token)