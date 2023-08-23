require('dotenv').config();
const Discord = require('discord.js')
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.GPT,
});

module.exports = {
    commands: ['checkCode'],
    description: "Verificador de código",

    callback: async (message, arguments, text, client) => {

        async function getGptResponse(message) {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You will be provided with a piece of any language code, and your task is to provide ideas for efficiency improvements.",
                    },
                    {
                        role: "user",
                        content: message.content.substring(11),
                    }
                ],
                temperature: 0,
                max_tokens: 1024,
            });

            return response
        }

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