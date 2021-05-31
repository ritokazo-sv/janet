const mongo = require('../../mongo')
const commandPrefixSchema =  require('../../schemas/command.prefix-schema')
const commandBase = require('../command-base')
const Discord = require('discord.js')

module.exports = {
    commands: 'setprefix',    
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<NOVO_PREFIXO_DO_BOT>",
    description: "Atualiza o Prefixo do Bot",
    callback: async (message, arguments, text) => {
        await mongo().then(async mongoose => {
            try {
                const guildId = message.guild.id
                const prefix = arguments[0]
                
                await commandPrefixSchema.findOneAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    prefix
                }, {
                    upsert: true
                })

                embed = new Discord.MessageEmbed()
                .setTitle(`Meu prefixo foi atualizado`)
                .setDescription(`Agora eu tenho um novo prefixo, \n \`\`\`Novo Prefixo: ${prefix}\`\`\` `)
                .setImage('https://cdn.god182.com/wp-content/uploads/2021/05/janet-feature.jpg')
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter(`Solicitado por ${message.author.username}`)

                message.channel.send(embed)

                // Update the cache
                commandBase.updateCache(guildId, prefix)

            } finally {
                mongoose.connection.close()
            }
        })
    },
    permissions: 'ADMINISTRATOR',
    permissionError: 'Você precisa ser admin para executar esse comando.',
    requiredRoles: [],
}