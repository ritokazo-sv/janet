const axios = require('axios')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const getHex = require('../../utils/getHex');

module.exports = {
    name: 'performance',
    category: 'Developer',
    description: 'Analisa performance de um site',
    options: [
        {
            name: 'url',
            description: 'Adicione a URL do seu site',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'user',
            description: 'Envia por DM para o usuário',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        async function getPerformance(url) {
             // Api endpoint
            const API_ENDPOINT = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile&locale=pt-BR`;

            var options = {
                method: 'GET',
                url: API_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'DiscordJS/14',
                }
            };
            
            try {
                const response = await axios.request(options);
                return response?.data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }

        const url = interaction.options.get('url').value.startsWith('https://') ? interaction.options.get('url').value : 'https://' + interaction.options.get('url').value;
        const performance = await getPerformance(url);

        if(performance) {
            const score = performance?.lighthouseResult?.categories?.performance?.score * 100;
            const fcp   = performance?.lighthouseResult?.audits['first-contentful-paint'].displayValue;
            const lcp   = performance?.lighthouseResult?.audits['largest-contentful-paint'].displayValue;
            const tbt   = performance?.lighthouseResult?.audits['total-blocking-time'].displayValue;
            const user  = interaction.options.getMember('user');
            let color;

            if (score > 90) {
                color = 0x00FF00;
            } else if (score >= 50 && score <= 89) {
                color = 0xFFFF00;
            } else {
                color = 0xFF0000;
            }

            const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Relatório de Performance')
            .setDescription(`Resultados para a URL ${url} \n\n O desempenho é de **${String(score)} pontos**. \n \u200B`) 
            .addFields(
                { name: 'FCP', value: fcp, inline: true },
                { name: 'LCP', value: lcp, inline: true },
                { name: 'TBT', value: tbt, inline: true },
            )  
            .setFooter({ text: `Solicitado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() })
            .setTimestamp();

            // if dm is choosed
            if(user) {
                const response = new EmbedBuilder().setTitle('Encaminhado para DM');

                if(user.user.id !== interaction.user.id) {
                    response.setDescription(`Mensagem enviada para ${user.user.globalName}`);
                }
                response.setFooter({ text: `Solicitado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() }).setTimestamp();
    
                // Embed Changes
                embed.setFooter({ text: `Enviado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() }).setTimestamp();
                
                // reply dm and update message on channel
                user.send({embeds: [embed]});
                interaction.editReply({ embeds: [response] });
                
                return;
            }
            
            interaction.editReply({embeds: [embed]});
        }
    }
}