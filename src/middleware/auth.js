const jwt = require('jsonwebtoken')
const Reporters = require('../models/reporters')
const auth= async(req,res,next)=>{
    try{
        const token= req.header('Authorization').replace('Bearer ','')
        console.log(token)

        // check token valid
        const decode = jwt.verify(token,'node course')
        // get reporters who is carring valid token
        const reporters = await Reporters.findOne({_id:decode._id,'tokens.token':token})
        console.log(reporters)
        
        if(!reporters){
            throw new Error()
        }
        req.reporters = reporters
        req.token = token
        next()
    }
    catch(e){
        res.status(401).send({error:'please authentication'})
    }
}


module.exports = auth
