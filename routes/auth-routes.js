const router = require('express').Router()
const passport = require('passport')
//auth Router
router.get('/login',(req, res)=>{
  res.render('login')
})

//auth logout
router.post('/logout',(req, res)=>{
  //handle with passport
  req.logout()
  res.redirect('/')
})

//auth with google
router.get('/google', passport.authenticate('google', {
  scope: ('profile')
}))

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/api/user')
})

module.exports = router
