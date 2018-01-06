const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Agent = require('./agent-model')

function validAgent(agentid, response){
  Agent.findById(agentid).then((agent)=>{
    if(agent)
      response(true)
    response(false)
  })
}

const saleSchema = new Schema({
  _id: String,
  date: Date,
  amount: Number,
  agent: {type: String, ref: 'agent', validate:{
    isAsync: true,
    validator: validAgent,
    message: 'Agent not found',
    required: true
  }},
  cusname: String,
  phno: String,
  details: String
})

module.exports = mongoose.model('sale',saleSchema)
