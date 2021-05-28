require('dotenv').config();

const Discord = require("discord.js")
const client = new Discord.Client()
const token = process.env.DISCORD_TOKEN
const { status } = require("./scripts/music")
const loadCommands = require('./commands/load-commands')

client.on('ready', async () => {

  console.log("Janet is Online baby!")

  // Default Status
  status(client, ' the office no vazio')

  // Carrega Todos Comandos
  loadCommands(client)

})

client.login(token)