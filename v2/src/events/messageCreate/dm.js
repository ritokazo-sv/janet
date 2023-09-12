module.exports = async (client, message) => {
    try {
        if(message.channel.type === 1) {
            await message.author.send('Olá, minha habilidade de responder aqui ainda está em desenvolvimento, por favor utilize meus comando no canal #janet');
            return;
        }
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
}
