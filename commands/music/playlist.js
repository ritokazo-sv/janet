const music = require("../../scripts/music.js")

module.exports =  {
    commands: ['playlist', 'list'],
    minArgs: 0,
    maxArgs: 0,
    description: "Mostra Lista de Músicas",
    callback: (message, arguments, text, client) => {  
      music.list(message)
    }
  }