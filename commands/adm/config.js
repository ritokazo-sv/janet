const Discord = require('discord.js')
const mongo = require('../../mongo')
const server = require('../../server/server-config')

module.exports = {
    commands: ['setleveling'],
    permissionError: 'Você precisa ser admin para executar esse comando.',
    minArgs: 1,
    maxArgs: 1,
    description: "Desabilita o Leveling do servidor",
    expectedArgs: '<on ou off>',
    callback: async (message, arguments, text, client) => {
       
        const { guild } = message
        const guildId = guild.id
        const option = arguments == 'on' ? true : false

        server.updateLeveling(message, guildId, option, client)

    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
}