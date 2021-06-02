const Discord = require('discord.js')
const mongo = require('../../mongo')
const profileSchema = require('../../schemas/profile-schema')

module.exports = {
    commands: ['rankserver'],
    description: "Te dá informações sobre os líderes do servidor",
    callback: async (message, arguments, text, client, prefix) => {

        await mongo().then(async mongoose => {
            try {
                const result = await profileSchema.find({ guildId: message.guild.id, }).sort({ level: -1, xp: -1 })

                embed = new Discord.MessageEmbed()
                .setTitle(`${ message.guild.name.toUpperCase() }`)
                .setDescription(`Lista dos maiores pontuadores do servidor`)
                .setAuthor(`${client.user.username}`, client.user.avatarURL())
                .setFooter(`2021 © ${client.user.username}.`)
                .setColor('RANDOM')

                if(result) {

                    let i = 1
                    for ( const list of result ) {
                        const { guild } = message
                        const member = guild.members.cache.get(list.userId)
                        const nome = member.nickname ? member.nickname : member.user.username
                        embed.addField(`${i}) ${ nome.toUpperCase() }`, ` Nível ${ list.level } (${ list.messageCount }pts)` )
                        i++

                        if(i == 5) break
                    }
                }

                message.channel.send(embed)
                

            } catch (err) {
                console.log(err)
            }
        })
    },
}