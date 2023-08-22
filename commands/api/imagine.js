require('dotenv').config();
const Discord = require('discord.js')

module.exports = {
    commands: ['imagine'],
    description: "Integração de Imagem com chat gpt",

    callback: async (message, arguments, text, client) => {

        const axios = require('axios')

        const API_ENDPOINT = 'https://api.openai.com/v1/images/generations';
        const BEARER_TOKEN = process.env.GPT;

        async function getGptResponse(message) {
            const payload = {
                "prompt": message.content.substring(9),
                "n": 1,
                "size": "512x512"
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

        // Test the function
        getGptResponse(message).then(response => {

            embed = new Discord.MessageEmbed()
            .setTitle(`Você imaginou:`)
            .setURL(`${response}`)
            .setImage(`${response}`)
            .setColor('random')
            .setTimestamp()
            .setFooter(`Solicitado por ${message.author.username}`)
            
            return message.channel.send(embed)
        });
    },
  }