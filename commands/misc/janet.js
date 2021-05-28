const Discord = require("discord.js")

module.exports = {
    commands: ['janet', 'j'],
    minArgs: 0,
    maxArgs: 0,
    description: "Saiba como adicionar a Janet no seu Servidor do Discord",
    callback: (message, arguments, text) => {
        embed = new Discord.MessageEmbed()
        .setTitle(`Adicione a Janet no seu Servidor`)
        .setDescription(`Utilize o link: \n https://discord.com/oauth2/authorize?=&client_id=846768664572723250&scope=bot&permissions=8`) 
        .setURL(`https://discord.com/oauth2/authorize?=&client_id=846768664572723250&scope=bot&permissions=8`)
        .setImage('https://static.onecms.io/wp-content/uploads/sites/6/2018/12/nup_183523_0087-2000.jpg')
        .setTimestamp()
        .setColor('7646FF')
        .setFooter(`Solicitado por ${message.author.username}`)

        return message.channel.send(embed)
    },
  }