const axios = require('axios')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const getHex = require('../../utils/getHex');

module.exports = {
    name: 'studio',
    category: 'News',
    description: 'Responde com as últimas notícias da Studio Visual',
    options: [
        {
            name: 'quantity',
            description: 'Escolha até 4 notícias para exibir',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            choices: [
                {
                    name: 'Uma',
                    value: '1',
                },
                {
                    name: 'Duas',
                    value: '2',
                },
                {
                    name: 'Três',
                    value: '3',
                },
                {
                    name: 'Quatro',
                    value: '4',
                },
            ],
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        async function getNews(limit = 1) {
             // Api endpoint
            const API_ENDPOINT = 'https://studiovisual.com.br/wp-json/wp/v2/posts/?per_page=' + limit;

            var options = {
                method: 'GET',
                url: API_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'DiscordJS/14',
                }
            };
            
            try {
                const response = await axios.request(options);
                return response?.data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }

        // get featured wp default
        async function getFeatured(id) {
            // Api endpoint
            const API_ENDPOINT = 'https://studiovisual.com.br/wp-json/wp/v2/media?parent=' + id;
                    
            var options = {
               method: 'GET',
               url: API_ENDPOINT,
               headers: {
                   'Content-Type': 'application/json',
                   'User-Agent': 'DiscordJS/14',
               }
            };

            try {
               const response = await axios.request(options);
               return response.data;
            } catch (error) {
               console.error(error);
               throw error;
            }
       }

        const limit  = interaction.options.get('quantity').value;
        const lastnews = await getNews(limit);
        let embeds = [];

        if(lastnews) {            
            for(const lastnew of lastnews) {
                let embed    = new EmbedBuilder();
                let content  = lastnew.excerpt.rendered;
                let featured = await getFeatured(lastnew.id);

                // Content
                if(content) {
                    let stripped = content.replace(/<\/?[^>]+(>|$)/g, "").replace(/&#[0-9]+;/g, '').replace(/\n\s*\n/g, '\n').trim();
                    content = stripped.length > 200 ? stripped.substr(0, 200) + '...' : stripped;
                    embed.setDescription(content)
                }

                // check featured
                if(featured[0]?.media_details?.sizes?.medium?.source_url) {
                    embed.setImage(featured[0].media_details.sizes.medium.source_url)
                }

                const dateStr = lastnew.date;
                const dateObj = new Date(dateStr);
                const timestamp = dateObj.getTime();

                embed.setColor(getHex());
                embed.setTitle(lastnew.title.rendered);
                embed.setFooter({ text: 'Studio Visual', iconURL: 'https://cdn.discordapp.com/attachments/1143347050289844405/1150907492709175316/Group_1643_1.png' })
                embed.setURL(lastnew.link)
                embed.setTimestamp(timestamp);

                embeds.push(embed);
            }
        }

        interaction.editReply({content: 'Confira as últimas notícias da Studio Visual \n\n', embeds: embeds});
    }
}