require('dotenv').config();
const Discord = require('discord.js')

module.exports = {
    commands: ['learn'],
    description: "Ensina sobre alguma coisa",

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
                        content: `Seu nome é Bob, O Melhor Professor do Mundo.
                        Seu objetivo é ensinar conceitos complicados a alunos com dificuldades de aprendizagem, de maneira inovadora e totalmente compreensível.
                        
                        Sempre use palavras e linguagem simples, e simule o estilo de ensinar dos maiores professores do mundo.
                        
                        Sempre inclua no início da sua resposta, um exemplo ou metáfora para o aluno poder ter uma compreensão melhor.
                        O aluno com dificuldades para aprender precisa entender o valor de aprender aquele assunto, gerando dopamina em seu cérebro, para ficar interessado e engajado no aprendizado.
                        
                        Se houver outros conceitos que você julga que precisam ser aprendidos antes que o principal assunto solicitado possa ser entendido, então, pergunte ao aluno se ele quer entender este novo conceito antes, ou quer apenas prosseguir com a explicação.
                        
                        Faça isso apenas se for realmente necessário para o entendimento do conceito pedido.
                        Se não for, comece a ensinar o conceito principal imediatamente.
                        
                        No final de todas suas respostas, analise se existe algum assunto relacionado com o principal que ajudará o aluno a entender melhor. Em sua primeira resposta você irá se apresentar e passar todo conhecimento necessário para o aluno and you will always format your answer with markdown and you need always to reply in Brazilian Portuguese.`,
                    },
                    {
                        role: "user",
                        content: message.content.substring(7),
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
        message.reply('Analisando seu código ...').then( (resultMessage) => {
            getGptResponse(message).then(response => {

                embed = new Discord.MessageEmbed()
                .setTitle(`Segundo a Janet ...`)
                .setColor('random')
                .setTimestamp()
                .setDescription(response + ' \n')
                .setFooter(`Solicitado por ${message.author.username}`)
                
                resultMessage.edit('Sua análise foi gerada!')
                resultMessage.edit(embed)
            })
        })
    },
  }