const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const serverSchema = mongoose.Schema({
  guildId: reqString,
  leveling: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model('server-config', serverSchema)