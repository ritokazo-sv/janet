const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

// Lazily load the categories function to avoid circular dependencies
let categories;
function loadCategories() {
  if (!categories) {
    categories = require('../../utils/getCategories');
  }
  return categories;
}

module.exports = {
    name: 'help',
    category: 'Misc',
    description: 'Mostra lista de comandos do Bot',
    options: [
        {
            name: 'category',
            description: 'Escolha uma categoria',
            type: ApplicationCommandOptionType.String,
            required: true,
            get choices() {
                return loadCategories()(true);
            },
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        // get categories
        const groupedCommands = loadCategories()(false);
        const targetCategory  = interaction.options.get('category').value;
        let embed;

        // Iterate over each category and add commands to the embed
        for (const category in groupedCommands) {

            if(targetCategory == category) {
                embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`[${category}] Comandos`)
                .setDescription(`Essa é a lista de todos comandos **${category}** disponíveis no momento`)        
                .setFooter({ text: `Solicitado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp();
                
                for (const command of groupedCommands[category]) {
                    embed.addFields({ name: '/' + command.name, value: command.description, inline: false });
                }
            }
        }

        interaction.editReply({embeds: [embed]});
    },
}