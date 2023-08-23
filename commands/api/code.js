require('dotenv').config();
const Discord = require('discord.js')

module.exports = {
    commands: ['code'],
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
                        content: "You will be provided with a piece of any code, and your task is to provide ideas for efficiency improvements and you will always format your answer with markdown.",
                    },
                    {
                        role: "user",
                        content: message.content.substring(6),
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