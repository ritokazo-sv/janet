const mongo = require('../mongo')
const Discord = require('discord.js')
const serverSchema = require('../schemas/server-schema')

const updateLeveling = async (message, guildId, option, client) => {
    
    await mongo().then(async mongoose => {

        try {

            const result = await serverSchema.findOneAndUpdate({
                guildId,
            },{
                guildId,                    
                leveling: option
            },{
                upsert: true,
                new: true
            })

            const opt = option == true ? 'Ligado' : 'Desligado'

            // Set Embed response
            embed = new Discord.MessageEmbed()
            .setTitle(`Você atualizou o Leveling`)
            .setDescription(`Agora o leveling no servidor está **${opt}**`)
            .setAuthor(`${client.user.username}`, client.user.avatarURL())
            .setColor('RANDOM')
            .setTimestamp()

            message.channel.send(embed)

        } finally {
            mongoose.connection.close()
        }

    })
}

module.exports = { updateLeveling }