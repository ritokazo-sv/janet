const axios = require('axios')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'imagine',
    category: 'AI',
    description: 'Gera uma imagem utilizando DALL-E',
    options: [
        {
            name: 'size',
            description: 'Escolha o tamanho da imagem',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: '1024x1024',
                    value: '1024x1024',
                },
                {
                    name: '512x512',
                    value: '512x512',
                },
                {
                    name: '256x256',
                    value: '256x256',
                },
            ],
        },
        {
            name: 'prompt',
            description: 'Escreva o código que deseja entender',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'user',
            description: 'Responde em modo privado',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
        {
            name: 'original',
            description: 'Exibe ou não a mensagem original',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const size         = interaction.options.get('size').value;
        const prompt       = interaction.options.get('prompt').value;
        const user         = interaction.options.getMember('user');
        const hide         = interaction.options.getBoolean('original');
        const API_ENDPOINT = 'https://api.openai.com/v1/images/generations';
        const BEARER_TOKEN = process.env.GPT;

        async function getGptResponse(size, prompt) {
            const payload = {
                "prompt": prompt,
                "n": 1,
                "size": size
            };
            
            const headers = {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            };
        
            try {
                const response = await axios.post(API_ENDPOINT, payload, { headers: headers });

                return response.data.data[0].url
            } catch (error) {
                console.error("Error calling the API:", error);
            }
        }

        const responseGPT = await getGptResponse(size, prompt);

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Janet imaginou...')
        .setURL(responseGPT)
        .setImage(responseGPT)      
        .setFooter({ text: `Solicitado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() })
        .setTimestamp();

        // if dm is choosed
        if(user) {
            const response = new EmbedBuilder().setTitle('Encaminhado para DM');
            response.setFooter({ text: `Solicitado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() }).setTimestamp();

            // Embed Changes
            const answer = hide ? '**' + user.user.globalName + ':** ```' + message + '```' : `Mensagem enviada por ${interaction.user.globalName} `;
            embed.setDescription(`${answer} \n\n **Janet respondeu:** \n ${responseGPT}`);
            
            // reply dm and update message on channel
            user.send({embeds: [embed]});
            interaction.editReply({ embeds: [response] });
            
            return;
        }

        interaction.editReply({embeds: [embed]});
    }
}