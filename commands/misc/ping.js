module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    description: "Responde Pong",
    ignore: true,
    callback: (message, arguments, text) => {
        message.reply('PONG!')
    },
  }