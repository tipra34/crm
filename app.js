const express = require('express')
const passport = require('passport')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth-routes')
const apiRoutes = require('./routes/api-routes')

mongoose.connect(keys.mongodb.dbURI,{useMongoClient: true},()=>{
  console.log("connected to db")
})

let app = express()

app.set('view engine', 'ejs')

//////passport setup
require('./config/passport-config')

//////////session
app.use(cookieSession({
  keys: [keys.session.cookieKey]
}))

app.use(express.static('./frontend/build'))

app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use('/auth',authRoutes)
app.use('/api', apiRoutes)

app.get('/*', (req,res)=>{
  res.sendFile('frontend/build/index.html', {root: __dirname })
})

app.listen(8000,()=>{
  console.log('listening on port 8000...')
})
