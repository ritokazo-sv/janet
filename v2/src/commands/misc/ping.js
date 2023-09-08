module.exports = {
    name: 'ping',
    category: 'Misc',
    description: 'Responde com o ping do Bot',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! A latência é de ${ping}ms. A latência da API é de ${client.ws.ping}ms`);
    }
}