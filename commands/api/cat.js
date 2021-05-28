const axios = require("axios")

module.exports = {
    commands: ['cat', 'gato'],
    minArgs: 0,
    maxArgs: 0,
    description: "Exibe gatos aleatórios",
    callback: (message, arguments, text, client) => {
      
        axios.get('https://api.thecatapi.com/v1/images/search')
        .then((res) => {
            message.reply(res.data[0].url)
        })
        .catch((err) => {
            console.error('ERR:', err)
        })
    },
  }