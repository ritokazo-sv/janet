const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder }        = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('janet')
        .setDescription('pinga the volta')
        .addStringOption(option => 
            option.setName('message')
                  .setDescription('The message you want the bot to say.')
                  .setRequired(true)
        )
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user you want to greet.')
                  .setRequired(false)
        )
    ,
    async execute(interaction) {
        // Params
        const message = interaction.options.getString('message');
        
        // Embed
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        await interaction.reply({ embeds: [exampleEmbed] });
    },
};