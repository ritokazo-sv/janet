const Discord = require('discord.js')
const fetch = require("node-fetch");


module.exports = {
    commands: ['gpt'],
    expectedArgs: '<prompt>',
    minArgs: 0,
    maxArgs: 1,
    description: "Integração de testes com o chat GPT",

    callback: async (message, arguments, text, client) => {

        const axios = require('axios');

        const API_ENDPOINT = 'https://api.openai.com/v1/completions';
        const BEARER_TOKEN = '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';

        async function getGptResponse(message) {
            const payload = {
                model: "text-davinci-003",
                prompt: `Retorne o prompt '${message}' somente em JSON separado por chave message e humor e com sua resposta em answer`,
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

        // Test the function
        getGptResponse(message).then(response => {
            console.log(response)

            embed = new Discord.MessageEmbed()
            .setTitle(`Segundo a Janet ...`)
            .setColor('7646FF')
            .setTimestamp()
            .setDescription(response.answer + ' \n Seu humor parecia estar ' + response.humor)
            .setFooter(`Solicitado por ${message.author.username}`)

            return message.channel.send(embed)
        });
    },
  }