const router = require('express').Router()
const NewUser = require('../models/unauthorised-user')
const User = require('../models/user-model')
const Agent = require('../models/agent-model')
const Sale = require('../models/sale-model')
const Chargeback = require('../models/chargeback-model')
const mongoose = require('mongoose')

function testUser(req, res, next){
    if(req.user)
      next()
    else
      res.redirect('/login')
}

function testTechnician(req, res, next){
  if(req.user.technician)
    next()
  else{
    res.status(401).send('unauthorised')
  }
}

function testAdmin(req, res, next){
  if(req.user.admin)
    next()
  else {
    res.status(401).send('unauthorised')
  }
}

router.use(testUser)

router.get('/user',(req, res)=>{
  res.send({username: req.user.username})
})

router.use(testAdmin)

router.post('/addsale',(req, res)=>{
  let {date, saleid, agentid, amount,phno, cusname, details} = req.body
  new Sale({
    _id: saleid,
    date: new Date(date),
    amount: Number(amount),
    agent: agentid,
    cusname,
    phno: Number(phno),
    details
  }).save((err)=>{
    if(err)
      res.status(500).send({code:500})
    else
      res.send({code:200})
  })
})

router.get('/querysale',(req, res)=>{
  let queryData = req.query
  let query = {}

  if(queryData.fromDate || queryData.toDate)
    query.date={}
  if(queryData.fromDate)
  query.date['$gte'] = new Date(queryData.fromDate)
  if(queryData.toDate)
    query.date['$lte'] = new Date(queryData.toDate)
  if(queryData.saleid)
    query._id = queryData.saleid
  if(queryData.agentid)
    query.agent = queryData.agentid
  if(queryData.cusname)
    query.cusname = queryData.cusname
  if(queryData.amount)
    query.amount = Number(queryData.amount)
  if(queryData.phno)
    query.phno = Number(queryData.phno)
    console.log(query)
  Sale.find(query).then((result)=>{
    res.send({salesList: result})
  }).catch((err)=>{
    console.log(err)
  })
})

router.post('/chargeback',(req, res)=>{
  let {date, saleid, details, amount} = req.body
  let chargebackSale
  Sale.findById(saleid).then((sale)=>{
    chargebackSale = sale
    sale.details = `Refund of Amount ${amount} ` + sale.details
    new Chargeback({
      date: new Date(date),
      _id: saleid,
      details,
      agent: sale.agent,
      amount: Number(amount),
      cusname: sale.cusname
    }).save((err)=>{
      if(err)
        res.status(500).send({err})
      else {
        res.send({code: 200})
        chargebackSale.save()
      }
    })
  })
})

router.get('/chargeback',(req, res)=>{
  let queryData = req.query
  let query = {}

  if(queryData.toDate || queryData.fromDate)
    query.date = {}
  if(queryData.fromDate)
    query.date['$gte'] = new Date(queryData.fromDate)
  if(queryData.toDate)
    query.date['$lte'] = new Date(queryData.toDate)
  if(queryData.agentid)
      query.agent = queryData.agentid
   else if(queryData.saleid){
    query._id = queryData.saleid
  }
  if(Object.keys(query).length)
    Chargeback.find(query, (err, chargebacks)=>{
      if(err)
        res.status(500).send({err})
      else
        res.send({chargebacks})
    })
  else
    res.send({chargebacks:[]})
})

router.get('/agents', (req, res)=>{
  Agent.find({}).then((agents)=>{
    res.send({agents})
  }).catch((err)=>{
    res.status(500).send(err)
  })
})

router.post('/removeagent', (req, res)=>{
  console.log(req.body.agentid)
  Agent.findOneAndRemove({_id: req.body.agentid}, (err)=>{
    if(!err)
      res.send({code:200})
    else
      res.status(500).send(err)
  })
})

router.post('/addagent',(req, res)=>{
  new Agent({
    _id: req.body.agentid,
    name: req.body.agentname
  }).save((err)=>{
    if(err){
      res.status(500).send({code: 500, message: err})
      console.log(err)
    } else res.send({code: 200})
  })
})

router.post('/authuser',(req, res)=>{
  let googleId = req.body.googleId
  let admin = req.body.admin //boolean
  let technician = req.body.technician //boolean
  if(googleId){
    User.findOne({googleId:googleId}).then((user)=>{
      if(user){
        user.admin = admin
        user.technician = technician
        user.save((err)=>{
          if(err)
            res.status(500).send({code: 500})
          else{
            res.send({code:200, user})
          }
        })
      } else res.status(400).send({code: 400})
    })
  } else res.status(400).send({code: 400})
})

router.get('/users', (req, res)=>{
  User.find({}).then((users)=>{
    res.send({users})
  })
})

router.post('/salesdata',(req, res)=>{
    //validating sales data
    let data = req.body
    if(data.phno && data.agent && data.details && data.date && data.cusname && data.id)
      new Sale({
        _id: data.id,
        date: data.date,
        agent: data.agent,
        cusname: data.cusname,
        phno: data.phno,
        details: data.details
      }).save((err)=>{
        if(err)
          res.status(500).send({code: 500})
        else
          res.send({code: 200})
      })
})

module.exports = router
