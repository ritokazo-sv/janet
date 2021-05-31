module.exports = {
    commands: ['clear', 'cc'],
    permissionError: 'Você precisa ser admin para executar esse comando.',
    minArgs: 0,
    maxArgs: 0,
    description: "Deleta mensagens do Canal",
    ignore: true,
    callback: (message, arguments, text) => {
        message.channel.messages.fetch().then(results => {
            message.channel.bulkDelete(results)
        })
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
}