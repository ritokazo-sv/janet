const Discord = require("discord.js");
const { token, options } = require("./config.json");
const command = require('./scripts/commands')
const music = require("./scripts/music.js");
const client = new Discord.Client();

client.once("ready", () => {
  // Oh Janet!
  console.log("Janet is Online baby!");

  // Seta o Status do Bot
  music.status(client, ' the office no vazio');
  
  // Lista Comandos do Bot
  command(client, ['help', 'ajuda'], (message) => {
    embed = new Discord.MessageEmbed()
    .setTitle(`Lista de Comandos da Janet`)
    .setDescription(`${options.join("\n")}`) 
    .setThumbnail('https://pbs.twimg.com/profile_images/911621253764603904/DXiJWgyl_400x400.jpg')
    .setTimestamp()
    .setFooter(`Solicitado por ${message.author.username}`)

    return message.channel.send(embed);
  })

  // Lista de Membros do Servidor
  command(client, ['membros', 'info'], (message) => {

    client.guilds.cache.forEach((guild) => {

      if(guild.id == message.guild.id) {
        embed = new Discord.MessageEmbed()
        .setTitle(`${guild.name}`)
        .setDescription(`Tem o total de ${guild.memberCount} membros`) 
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
    music.status(client, ' umas músicas doidas', 2);
    music.ysearch(message);
  })

  // Comando para Listar Músicas na Fila
  command(client, 'playlist', (message) => {
    music.list(message);
  })

  // Comando para pular de Música
  command(client, 'skip', (message) => {
    music.skip(message);
  })

  // Comando para Parar a Janet
  command(client, 'stop', (message) => {
    music.stop(message);
    music.status(client, ' tibia no vazio', 0);
  })
  // End Music Bot

});

client.login(token);