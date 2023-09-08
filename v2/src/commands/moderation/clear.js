const { Client, Interaction, PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const amount = interaction.options.get('amount').value;
        const target = interaction.options.get('target')?.member;
        const {channel, options} = interaction;
        const messages = await channel.messages.fetch({limit: amount + 1});
        const embed = new EmbedBuilder().setColor(0x0099FF);

        try {
            if(target) {
                let i = 0;
                const filtered = [];
    
                (await messages).filter((msg) => {
                    if(msg.author.id === target.id && amount > i) {
                        filtered.push(msg);
                        i++;
                    }
                });
    
                await channel.bulkDelete(filtered).then(messages => {
                    embed.setDescription(`Foram deletadas ${messages.size} mensagens de ${target}`);
                    interaction.reply({embeds: [embed]});
                });
            }else {
                await channel.bulkDelete(amount, true).then(messages => {
                    embed.setDescription(`Foram deletadas ${messages.size} mensagens`);
                    interaction.reply({embeds: [embed]});
                });
            }

            return;
        } catch (error) {
            await interaction.reply(`Ocorreu um erro! Erro: ${error}`);
            return;
        }
    },

    name: 'clear',
    description: 'Limpa mensagens do canal',
    category: 'Moderador',
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: 'amount',
            description: 'Quantidade de mensagens a serem apagadas',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: 'target',
            description: 'Usuário que serão deletadas mensagens',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
}