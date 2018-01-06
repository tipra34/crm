const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  googleId: String,
  technician: {type: Boolean, default: false},
  admin: {type: Boolean, default: false}
})

module.exports = mongoose.model('user', userSchema)
