const loadCommands = require('./load-commands')
const { prefix } = require('../config.json')
const Discord = require("discord.js")

module.exports =  {
    commands: ['help', 'h'],
    description: "Saiba todos os comandos da Janet",
    ignore: true,
    callback: (message, arguments, text) => {
        let reply = "Olá, eu sou a Janet, aqui estão meus comandos.\n \n";
        let helpers = false;

        const commands = loadCommands()

        for(const command of commands) {

            let permissions = command.permission

            if (permissions) {
                let hasPermission = true

                if(typeof permissions === 'string') {
                    permissions = [permissions]
                }

                for (const permission of permissions) {
                    if(!message.member.hasPermission(permission)) {
                        hasPermission = false
                        break
                    }
                }

                if(!hasPermission) {
                    continue
                }
            }

            // Formata o Texto
            const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands[0]
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const { description, ignore } = command 

            if(!ignore) {
                reply += `**${prefix}${mainCommand}${args}** = ${description} \n`
                helpers = true
            }
        }

        // Caso não existam comandos disponíveis
        if(!helpers) {
            reply = `Ainda estou sem comandos disponíveis  :smiling_face_with_tear: `
        }

        // Sent Back a Embed List
        embed = new Discord.MessageEmbed()
        .setTitle(`Lista de Comandos da Janet`)
        .setDescription(`${reply}`) 
        .setColor('7646FF')
        .setThumbnail('https://pbs.twimg.com/profile_images/911621253764603904/DXiJWgyl_400x400.jpg')
        .setTimestamp()
        .setFooter(`Solicitado por ${message.author.username}`)

        message.channel.send(embed)
    }

}