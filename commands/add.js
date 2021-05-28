module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: 'Você precisa ser admin para executar esse comando.',
    minArgs: 2,
    maxArgs: 2,
    description: "Soma dois números",
    ignore: true,
    callback: (message, arguments, text) => {
      const num1 = +arguments[0]
      const num2 = +arguments[1]
  
      message.reply(`A Soma é ${num1 + num2}`)
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
  }