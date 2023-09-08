const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('user').value;
        const duration     = interaction.options.get('duration').value;
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
            await interaction.editReply("Você não pode silenciar no dono do servidor!");
            return;
        }

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Você não pode silenciar nesse usuário, porque ele possui uma role igual/superior a sua!");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Você não pode silenciar nesse usuário, porque ele possui uma role igual/superior a minha!");
            return;
        }

        const msDuration = ms(duration);

        if(isNaN(msDuration)) {
            await interaction.editReply("Duração inválida!");
            return;
        }

        if(msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply("Não pode ser menor que 5 segundos ou maior que 28 dias!");
            return;
        }

        // Ban the target user
        try {
            const { default: prettyMs } = await import('pretty-ms');

            if(targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`O mute no usuário ${targetUser} foi atualizado para ${prettyMs(msDuration, { verbose: true })} \n Motivo: ${reason}`);
                return;
            }

            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} foi silenciado por ${prettyMs(msDuration, { verbose: true })} \n Motivo: ${reason}`);

        } catch (error) {
            await interaction.editReply(`Não foi possível silenciar o usuário! Erro: ${error}`);
            return;
        }
    },

    name: 'timeout',
    description: 'Silencia um membro do servidor',
    category: 'Moderador',
    devOnly: true,
    testOnly: false,
    options: [
        {
            name: 'user',
            description: 'O usuário que você quer silenciar',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'duration',
            description: 'Duração do silêncio (30m, 1h, 1dia)',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'reason',
            description: 'Razão para silenciar',
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
}