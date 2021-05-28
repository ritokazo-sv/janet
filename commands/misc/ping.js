module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    description: "Mostra latência e o ping do servidor",
    callback: (message, arguments, text, client) => {
       message.reply('Calculando ping ...').then( (resultMessage) => {
        const ping = resultMessage.createdTimestamp - message.createdTimestamp
        resultMessage.edit(`Latência do Bot: ${ping}ms | Latência da Api: ${client.ws.ping}ms `)
       })
    },
  }