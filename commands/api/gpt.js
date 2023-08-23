require('dotenv').config();
const Discord = require('discord.js')

module.exports = {
    commands: ['gpt'],
    description: "Integração de testes com o chat GPT",

    callback: async (message, arguments, text, client) => {

        const axios = require('axios')

        const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
        const BEARER_TOKEN = process.env.GPT;

        async function getGptResponse(message) {
            const payload = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Você sempre responderá qualquer pergunta com o melhor da sua experiência, e formatará as resposta em markdown",
                    },
                    {
                        role: "user",
                        content: message.content.substring(5),
                    }
                ],
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

        // Test the function
        getGptResponse(message).then(response => {

            embed = new Discord.MessageEmbed()
            .setTitle(`Segundo a Janet ...`)
            .setColor('random')
            .setTimestamp()
            .setDescription(response + ' \n')
            .setFooter(`Solicitado por ${message.author.username}`)
            
            return message.channel.send(embed)
        });
    },
  }