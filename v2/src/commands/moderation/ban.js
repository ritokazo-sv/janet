const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user').value;
        const reason       = interaction.options.get('reason')?.value || "Nenhuma razão fornecida";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("O usuário não existe mais nesse servidor!");
            return;
        }

        const targetUserRolePosition  = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition         = interaction.guild.members.me.roles.highest.position;

        if(targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("Você não pode banir o dono do servidor!");
            return;
        }

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Você não pode banir esse usuário, porque ele possui uma role igual/superior a sua!");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Você não pode banir esse usuário, porque ele possui uma role igual/superior a minha!");
            return;
        }

        // Ban the target user
        try {
            await targetUser.ban({ reason });
            await interaction.editReply(`O usuário ${targetUser} foi banido \n Motivo: ${reason}`);
        } catch (error) {
            await interaction.editReply(`Não foi possível banir o usuário! Erro: ${error}`);
            return;
        }
    },

    name: 'ban',
    description: 'Bane um membro do servidor',
    category: 'Moderador',
    devOnly: true,
    //testOnly: false,
    options: [
        {
            name: 'user',
            description: 'The user to ban!!',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'reason',
            description: 'The reason for banning',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
}