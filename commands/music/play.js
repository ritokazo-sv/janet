const music = require("../../scripts/music.js")

module.exports =  {
    commands: ['play', 'p'],
    expectedArgs: '<nome da musica>',
    minArgs: 1,
    maxArgs: 1000,
    description: "Chama a Janet para tocar umas músicas",
    callback: (message, arguments, text, client) => {  
      music.status(client, ' umas músicas doidas', 2)
      music.ysearch(message)
    }
  }