require('dotenv').config();
const Discord = require("discord.js")

module.exports = {
    commands: ['loud'],
    minArgs: 1,
    maxArgs: 999,
    expectedArgs: '<target channel>',
    description: "Envia o bot para uma sala",
    callback: (message, arguments, text, client) => {

        // Concatena Parametrons em String
        let param = arguments.toString().split(',').join('+').toUpperCase()

        console.log('message.mentions');
        
    },
  }