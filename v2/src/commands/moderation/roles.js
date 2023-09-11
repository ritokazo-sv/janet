const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'addrole',
    category: 'Moderador',
    description: 'Adiciona role para comandos que são limitados',
    options: [
        {
            name: 'role',
            description: 'Selecione a role para adicionar permissão',
            type: ApplicationCommandOptionType.Role,
            required: false,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        // add role to database
    }
}