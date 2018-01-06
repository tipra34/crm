const mongoose = require('mongoose')
const Schema = mongoose.Schema

const unauthorisedUserSchema = new Schema({
  username: String,
  googleId: String
})

module.exports = mongoose.model('newUser', unauthorisedUserSchema)
