const music = require("../../scripts/music.js")

module.exports =  {
    commands: ['stop', 'parar'],
    minArgs: 0,
    maxArgs: 0,
    description: "Faz a Janet parar de tocar",
    callback: (message, arguments, text, client) => {  
        music.stop(message)
        music.status(client, ' tibia no vazio', 0)
    }
  }