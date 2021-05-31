require('dotenv').config();

const Discord = require("discord.js")
const client = new Discord.Client()
const token = process.env.DISCORD_TOKEN
const { status } = require("./scripts/music")
const loadCommands = require('./commands/load-commands')
const commandBase = require('./commands/command-base')

client.on('ready', async () => {

  console.log("Janet is Online baby!")

  // Default Status
  status(client, ' the office no vazio')

  commandBase.loadPrefixes(client)
  loadCommands(client)

})

client.login(token)