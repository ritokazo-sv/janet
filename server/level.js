const mongo = require('../mongo')
const Discord = require('discord.js')
const profileSchema = require('../schemas/profile-schema')
const serverSchema = require('../schemas/server-schema')
let isleveling = true

module.exports = async (client) => {

    client.on('message', async message => {
        
        if(message.author.bot) return;

        await mongo().then(async mongoose => {
            try {
                for (const guild of client.guilds.cache) {
                    const guildId = guild[1].id
                    const result = await serverSchema.findOne({ guildId: guildId })
                    if(result) {
                        isleveling = result.leveling
                    } 
                }
            }finally {
                mongoose.connection.close()
            }
        })

        const { guild, member } = message

        if(isleveling) {            
            addXp(guild.id, member.id, 15, message)
            return
        }

        messageCount(guild.id, member.id)
        console.log('HERE')
    })

}

const getNeededXp = level => level * level * 100

const addXp = async (guildId, userId, xpToAdd, message) => {
    await mongo().then(async mongoose => {
        try {
            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            },{
                guildId,
                userId,
                $inc: {
                    xp: xpToAdd,
                    messageCount: 1,
                },
            },{
                upsert: true,
                new: true
            })

            let { xp, level } = result
            const needed = getNeededXp(level)

            // Passou de Nível
            if(xp >= needed) {
                ++level
                xp -= needed

                // Envia mensagem Embed with image
                embed = new Discord.MessageEmbed()
                .setTitle(`Passou para o nível ${level}`)
                .setDescription(`Você precisa de **${getNeededXp(level)} XP** para o próximo nível`)
                .setAuthor(`${message.author.username}`, `${message.author.avatarURL()}`)
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter(`By Mestre Janet`)

                // Aguarda 1,5 segundos para enviar a mensagem
                setTimeout(() => { message.reply(embed) }, 1500)               

                await profileSchema.updateOne({
                    guildId,
                    userId
                }, {
                    level,
                    xp
                })
            }

        } finally {
            mongoose.connection.close()
        }
    })
}

const messageCount = async (guildId, userId) => {
    await mongo().then(async mongoose => {
        try {
            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId
            },{
                guildId,
                userId,
                $inc: {
                    messageCount: 1,
                },
            },{
                upsert: true,
                new: true
            })

            console.log(result)

        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.messageCount = messageCount
module.exports.addXp = addXp