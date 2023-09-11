const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, message) => {
    try {
        await message.author.send('Olá, minha habilidade de responder aqui ainda está em desenvolvimento, por favor utilize meus comando no canal #janet');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
}
