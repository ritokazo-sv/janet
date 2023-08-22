const Discord = require('discord.js')

module.exports = {
    commands: ['imagine'],
    description: "Integração de Imagem com chat gpt",

    callback: async (message, arguments, text, client) => {

        const axios = require('axios')

        const API_ENDPOINT = 'https://api.openai.com/v1/images/generations';
        const BEARER_TOKEN = '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';

        async function getGptResponse(message) {
            const payload = {
                "prompt": message,
                "n": 1,
                "size": "512x512"
            };
        
            const headers = {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            };
        
            try {
                const response = await axios.post(API_ENDPOINT, payload, { headers: headers });
                
                // Directly extract the "message", "answer", and "humor" values from the response
                const jsonResponse = JSON.parse(response.data.url)
        
                return {
                    image: jsonResponse,
                };
            } catch (error) {
                console.error("Error calling the API:", error);
            }
        }

        console.log(message.author)

        // Test the function
        getGptResponse(message).then(response => {
            embed = new Discord.MessageEmbed()
            .setTitle(`Você imaginou:`)
            .setURL(`${response.image}`)
            .setImage(`${response.image}`)
            .setColor('random')
            .setTimestamp()
            .setFooter(`Solicitado por ${message.author.username}`)

            return message.channel.send(embed)
        });
    },
  }