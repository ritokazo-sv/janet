const YOUTUBE_API = process.env.YOUTUBE_API;
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const search = require('youtube-search')
const opts = {
    maxResults: 5,
    key: YOUTUBE_API,
    type: 'video'
}

const queue = new Map();

async function ysearch(message) {
    
    const serverQueue = queue.get(message.guild.id);

    // Busca argumentos
    const args = message.content.split(" ");

    if(!args[1]) {
        return message.channel.send('> Você precisa me passar um parametro');
    }

    // Isso aqui faz mágica
    let query = args.slice(1, args.length).toString().split(",").join("+")
    let results = await search(query, opts).catch(err => console.log(err))

    if(results) {

        let youtubeResults = results.results
        let i = 0
        let titles = youtubeResults.map(result => {
            i++;
            return i + ") " + result.title
        })

        let embed = new Discord.MessageEmbed()
            .setTitle(`Escolha a música que quer ouvir`)
            .setAuthor('Janet Disco', 'https://static.wikia.nocookie.net/thegoodplace/images/3/3c/6F0B9E9F-8412-4E4B-800E-E3BE42E50114.jpeg')
            .setDescription(titles.join("\n")) 
            .setTimestamp()
            .setColor('7646FF')
            .setFooter(`Solicitado por ${message.author.username}`)
        
        message.channel.send(embed)

        // Filtra e Coleta Mensagens de Escolha do Usuário
        filter = m => (m.author.id === message.author.id) && m.content <= youtubeResults.length
        let collected = await message.channel.awaitMessages(filter, { max: 1 })
        let selected = youtubeResults[collected.first().content - 1]

        embed = new Discord.MessageEmbed()
            .setTitle(`${selected.title}`)
            .setURL(`${selected.link}`)
            .setDescription(`${selected.description}`)
            .setThumbnail(`${selected.thumbnails.default.url}`)    
            .setTimestamp()
            .setColor('7646FF')
            .setFooter(`Solicitado por ${message.author.username}`)    
        
        // Executa Função de Play
        execute(message, serverQueue, selected, embed)

    }
}

async function execute(message, serverQueue, music, embed) {

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send('> Você precisa estar em um canal, para ouvir música :)');
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send('> Preciso de permissões para poder entrar e tocar músicas!');
  }

  const songInfo = await ytdl.getInfo(music.link);
  const song = {
        title: songInfo.videoDetails.title,
        description: music.description,
        thumb: music.thumbnails.default.url,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0], embed);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);

    embed = new Discord.MessageEmbed()
            .setTitle(`[NA FILA] ${song.title}`)
            .setURL(`${song.url}`)
            .setDescription(`${song.description}`)
            .setThumbnail(`${song.thumb}`)    
            .setTimestamp()
            .setColor('7646FF')
            .setFooter(`Solicitado por ${message.author.username}`)
    return message.channel.send(embed);
  }
}

function skip(message) {
  const serverQueue = queue.get(message.guild.id);

  if (!message.member.voice.channel)
    return message.channel.send('> Você precisa estar em uma canal de voz para interromper a música!');
  if (!serverQueue)
    return message.channel.send('> Nenhuma música na fila para pular!');

  serverQueue.connection.dispatcher.end();

  if(serverQueue.songs[1]) {
    return message.channel.send(`> :play_pause: Tocando agora **${serverQueue.songs[1].title}**`);
  }
  return message.channel.send(`> Sem Mais músicas para Tocar.`);
}

function stop(message) {
  const serverQueue = queue.get(message.guild.id);

  if (!message.member.voice.channel)
    return message.channel.send('> Você precisa estar em um canal de voz para interromper a música!');
    
  if (!serverQueue)
    return message.channel.send('> Nenhuma música na fila para pular!');
    
  serverQueue.songs = []
  serverQueue.connection.dispatcher.end()

  return message.channel.send('> :stop_button: Fui parada.');
}

function play(guild, song, embed) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave()
    queue.delete(guild.id)
    return
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift()
      play(guild, serverQueue.songs[0])
    })
    .on("error", error => console.error(error))
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
    if(embed) {
      serverQueue.textChannel.send(embed)
    }  
}

function list(message) {
  const serverQueue = queue.get(message.guild.id);
  let i = 0

  if(serverQueue) {
    let titles = serverQueue.songs.map(result => {
      i++;
      return i + ") " + result.title;
    });
  
    embed = new Discord.MessageEmbed()
    .setTitle(`Músicas na Fila`)
    .setDescription(titles.join("\n"))  
    .setTimestamp()
    .setColor('7646FF')
    .setFooter(`Solicitado por ${message.author.username}`)

    return  message.channel.send(embed);
  }
  
  return message.channel.send('> Não existem músicas na fila');

}

// Atualiza Status da Janet
function status(client, status, type = 3) {

  client.user.setPresence({
    activity: {
      name: status,
      type: type,
    },
  });

}

module.exports = { execute, play, stop, skip, execute, ysearch, list, status };