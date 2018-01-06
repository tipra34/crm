const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user-model')
const NewUser = require('../models/unauthorised-user')

passport.serializeUser((user, done)=>{
  done(null, user.id)
})

passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy({
  //options for the google strategy
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: '/auth/google/redirect'
},(accessToken, refreshToken, profile, done)=>{
    //check if user already exists
    User.findOne({googleId: profile.id}).then((currentUser)=>{
      if(currentUser){
        // already have the user
        done(null, currentUser)
      }else{
        // create new user
        new User({
          username: profile.displayName,
          googleId: profile.id
        }).save().then((newUser)=>{
          done(null, newUser)
        })

      }
    })

  })
)
