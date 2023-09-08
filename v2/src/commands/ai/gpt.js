const axios = require('axios')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'gpt',
    category: 'AI',
    description: 'Chat GPT 3.5 já com prompts pré escritos',
    options: [
        {
            name: 'mode',
            description: 'Escolha o modo de uso',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Modo Padrão',
                    value: 'default',
                },
                {
                    name: 'Explicar Código',
                    value: 'explain',
                },
                {
                    name: 'Traduzir',
                    value: 'translate',
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

        let response;
        const mode    = interaction.options.get('mode').value;
        const message = interaction.options.get('prompt').value;
        const user    = interaction.options.getMember('user');
        const hide    = interaction.options.getBoolean('original');

        // if default mode
        if(mode === 'default') {
            response = {
                title: 'Janet GPT 3.5',
                prompt: [
                    {
                        role: "system",
                        content: "Você sempre responderá qualquer pergunta com o melhor da sua experiência, e formatará as resposta em markdown",
                    },
                    {
                        role: "user",
                        content: message,
                    }
                ]
            };
        }

        // If explain mode
        if(mode === 'explain') {
            response = {
                title: 'Explicando o código...',
                prompt: [
                    {
                        role: "system",
                        content: "You will be provided with a piece of code, and your task is to explain it in a concise way and you will always format your answer with markdown and you need always to reply in Brazilian Portuguese.",
                    },
                    {
                        role: "user",
                        content: message,
                    }
                ]
            };
        }

        // If translate mode
        if(mode === 'translate') {
            response = {
                title: 'Seu texto traduzido',
                prompt: [
                    {
                        role: "system",
                        content: "You will be provided with a sentence in English, and your task is to translate it into Brazilian Portugues e você sempre responderá qualquer pergunta com o melhor da sua experiência, e formatará as resposta em markdown",
                    },
                    {
                        role: "user",
                        content: message,
                    }
                ]
            };
        }

        // Api endpoint
        const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
        const BEARER_TOKEN = process.env.GPT;

        async function getGptResponse(message) {
            const payload = {
                model: "gpt-3.5-turbo",
                messages: response.prompt,
            };
        
            const headers = {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            };
        
            try {
                const response = await axios.post(API_ENDPOINT, payload, { headers: headers });

                return response.data.choices[0].message.content
                
            } catch (error) {
                console.error("Error calling the API:", error);
            }
        }

        const responseGPT = await getGptResponse(message);

        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(response.title)
        .setDescription(responseGPT)        
        .setFooter({ text: `Solicitado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() })
        .setTimestamp();

        // if dm is choosed
        if(user) {
            const response = new EmbedBuilder().setTitle('Encaminhado para DM');
            response.setFooter({ text: `Solicitado por ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() }).setTimestamp();

            // Embed Changes
            const answer = hide ? '**' + user.user.globalName + ':** ```' + message + '```' : `Mensagem enviada por ${interaction.user.globalName} `;
            embed.setDescription(`${answer} \n\n **Janet respondeu:** \n ${responseGPT} \n\n`);
            
            // reply dm and update message on channel
            user.send({embeds: [embed]});
            interaction.editReply({ embeds: [response] });
            
            return;
        }

        interaction.editReply({embeds: [embed]});
    }
}