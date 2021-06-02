const Discord = require('discord.js')
const mongo = require('../../mongo')
const profileSchema = require('../../schemas/profile-schema')

module.exports = {
    commands: ['userinfo'],
    description: "Te dá informações sobre um usuário do canal ou use @usermention",
    callback: async (message, arguments, text, client, prefix) => {
       
        const { guild, channel } = message

        const user = message.mentions.users.first() || message.member.user
        const member = guild.members.cache.get(user.id)

        await mongo().then(async mongoose => {
            try {
                const result = await profileSchema.findOne({ guildId: guild.id, userId: user.id })
                const username = member.nickname || user.username.toUpperCase()

                embed = new Discord.MessageEmbed()
                .setTitle(`${ username }`)
                .addField('**TAG**', `${user.tag}`)
                .addField('**Entrou no Servidor**', new Date(member.joinedTimestamp).toLocaleDateString() )
                .addField('**Entrou no Discord**', new Date(user.createdTimestamp).toLocaleDateString() )
                .setThumbnail(user.avatarURL())
                .setFooter(`2021 © ${client.user.username}.`)
                .setColor('RANDOM')

                if(result) {
                    const level = result.level || 1
                    const xp = result.xp || 0
                    const messagesCount = result.messageCount || 0
                    embed.setTitle(`[NÍVEL ${level}] ${ username }`) 
                    embed.setDescription(`Já enviou **${ messagesCount } mensagens** aqui.`)
                }

                if(user.bot) {
                    embed.setTitle(`${user.username.toUpperCase()} é um BOT`)
                }

                message.channel.send(embed)
                

            } catch (err) {
                console.log(err)
            }
        })
    },
}