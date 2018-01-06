const mongoose = require('mongoose')
const Schema = mongoose.Schema

const agentSchema = new Schema({
  _id: String,
  name: String
})

module.exports = mongoose.model('agent', agentSchema)
