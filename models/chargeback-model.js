const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chargebackSchema = new Schema({
  _id: String,
  date: Date,
  amount: Number,
  agent: String,
  cusname: String,
  details: String
})

module.exports = mongoose.model('chargeback', chargebackSchema)
