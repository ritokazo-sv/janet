const Discord = require('discord.js')

module.exports = {
    commands: ['gpt'],
    description: "Integração de testes com o chat GPT",

    callback: async (message, arguments, text, client) => {

        const axios = require('axios')

        const API_ENDPOINT = 'https://api.openai.com/v1/completions';
        const BEARER_TOKEN = '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';

        async function getGptResponse(message) {
            const payload = {
                model: "text-davinci-003",
                prompt: `Retorne o prompt '${message}' somente em JSON separado por chave message e humor e com sua resposta em answer e formate a resposta em markdown`,
                temperature: 0.3,
                max_tokens: 300,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            };
        
            const headers = {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            };
        
            try {
                const response = await axios.post(API_ENDPOINT, payload, { headers: headers });
                
                // Directly extract the "message", "answer", and "humor" values from the response
                const jsonResponse = JSON.parse(response.data.choices[0].text.trim())
                const message = jsonResponse.message
                const answer = jsonResponse.answer
                const humor = jsonResponse.humor
        
                return {
                    message: message,
                    answer: answer,
                    humor: humor
                };
            } catch (error) {
                console.error("Error calling the API:", error);
            }
        }

        console.log(message.author)

        // Test the function
        getGptResponse(message).then(response => {
            embed = new Discord.MessageEmbed()
            .setTitle(`Segundo a Janet ...`)
            .setColor('random')
            .setTimestamp()
            .setDescription(response.answer + ' \n')
            .setFooter(`Solicitado por ${message.author.username}`)

            return message.channel.send(embed)
        });
    },
  }