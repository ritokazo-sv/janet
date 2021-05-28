const music = require("../../scripts/music.js")

module.exports =  {
    commands: ['skip', 's'],
    minArgs: 0,
    maxArgs: 0,
    description: "Pula para a próxima música",
    callback: (message, arguments, text, client) => {  
        music.skip(message)
    }
  }