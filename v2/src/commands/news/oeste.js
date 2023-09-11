const axios = require('axios')
const { EmbedBuilder } = require('discord.js');
const getHex = require('../../utils/getHex');

module.exports = {
    name: 'oeste',
    category: 'News',
    description: 'Responde com as últimas notícias da Revista Oeste',

    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        async function getNews(id = null) {
             // Api endpoint
            const API_ENDPOINT = id ? 'https://revistaoeste.com/wp-json/oeste-api/v1/posts/' + id : 'https://revistaoeste.com/wp-json/oeste-api/v1/posts?limit=4';
            const BEARER_TOKEN = process.env.oeste;

            var options = {
                method: 'GET',
                url: API_ENDPOINT,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'DiscordJS/14',
                    Authorization: `Bearer ${BEARER_TOKEN}`
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

        const lastnews = await getNews();
        let embeds = [];

        if(lastnews.data) {            
            for(const lastnew of lastnews.data) {
                let embed   = new EmbedBuilder();
                let details = await getNews(lastnew.id);

                // Details
                if(details.data) {
                    let stripped = details.data[0].content.replace(/<\/?[^>]+(>|$)/g, "").replace(/&#[0-9]+;/g, '').replace(/\n\s*\n/g, '\n').trim();
                    let content = stripped.length > 200 ? stripped.substr(0, 200) + '...' : stripped;
                    embed.setDescription(content)
                }

                // public date
                const dateString = lastnew.publication_date;
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');
                const [hours, minutes, seconds] = timePart.split(':');
                const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);

                embed.setColor(getHex())
                embed.setTitle(lastnew.title)
                embed.setFooter({ text: 'Revista Oesta', iconURL: 'https://medias.revistaoeste.com/qa-staging/wp-content/uploads/2021/04/logo-avatar-redes-sociais-escuro-300x300.jpg.webp' })
                embed.setImage(lastnew.featured_image)
                embed.setURL(lastnew.permalink)
                embed.setTimestamp(dateObj);

                embeds.push(embed);
            }            
        }

        interaction.editReply({content: 'Últimas 4 notícias do site revistaoeste.com \n\n', embeds: embeds});
    }
}