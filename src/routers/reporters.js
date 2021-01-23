const express = require('express')
const router= new express.Router()
const Reporters = require('../models/reporters')
const auth = require('../middleware/auth.js')

/////////////////////////////////////////////////////////////

// post

router.post('/reporters', async(req,res)=>{
    const reporters = new Reporters(req.body)
    try{
        await reporters.save()
        const token = await reporters.generateToken()
        res.status(200).send({reporters,token})
        console.log(token)
    }
    catch(e){
        res.status(400).send(e)
    }
})

////////////////////////////////////////////////////////////////////

// Get all

router.get('/reporters',async(req,res)=>{
    try{
        const reporters= await Reporters.find({})
        res.status(200).send(reporters)
    }
    catch(error){
        res.status(500).send("internal server error")
    }
})

/////////////////////////////////////////////////////////////////

//Get by id

router.get('/reporters/:id',auth,async(req,res)=>{
    console.log(req.params)
    const _id = req.params.id
    try{

        const reporters = await Reporters.findById(_id)
        
            if(!reporters){
                return res.status(400).send('unable to send reporters')
            }
            res.status(200).send(reporters)
    }
    catch(e){
        res.status(500).send('internal server error')
    }

})

/////////////////////////////////////////////////////////////////

// update

router.patch('/reporters/:id',auth, async(req,res)=>{
    
    const updates = Object.keys(req.body) 
    console.log(updates)

    // const allawedupdates = ['name','password']

    // var isValid = updates.every((update)=> allawedupdates.includes(update))
    
    // console.log(isValid)
    // if(!isValid){
    //    return res.status(400).send('cant not update')
    // }
    const _id=req.params.id
    try{

        const reporters = await Reporters.findById(_id)
        console.log(reporters) 
        updates.forEach((update)=>reporters[update]=req.body[update])
        await reporters.save()


        if(!reporters){
            return res.send('no reporters found')
        }
        res.status(200).send(reporters)
        
    }catch(e){
        res.status(400).send('Error has occured')
    }

})


//////////////////////////////////////////////////////////////////

//Delete

router.delete('/reporters/:id',auth,async(req,res)=>{
    console.log(req.params)
    const _id = req.params.id
    try{
        const reporters = await Reporters.findByIdAndDelete(_id)
        if(!reporters){
            return res.status(400).send('unable to send reporters')
        }
        res.status(200).send(reporters)
    }catch(e){
        res.status(500).send('internal server error')
    }

})


///////////////////////////////////////////////////////////////////

// login

 router.post('/reporters/login',async (req,res)=>{
     try{
        
        const reporters = await Reporters.findByCredentials(req.body.email,req.body.password)
        const token = await reporters.generateToken() 
        res.send({reporters,token})
        
     }catch(error){
        
        res.status(400).send('Unable to login'+error)
     }
 })

///////////////////////////////////////////////////////////////////////////////////

// Profile
router.get('/profile',auth,(req,res)=>{
    res.send(req.reporters)
})

////////////////////////////////////////////////////////////////////////

// Logout

router.post('/logout',auth,async(req,res)=>{
    try{

        req.reporters.tokens = req.reporters.tokens.filter((el)=>{
            return el.token !== req.token
        })
        await req.reporters.save()
        res.send('logout success')
    }
    catch(e){
        res.status(500).send('please login')
    }

})
//////////////////////////////////////////////////////////////

// Logout All

router.post('/logoutAll',auth,async(req,res)=>{
    try{
        req.reporters.tokens = []
        await req.reporters.save()
        res.send('logout all success')
    }
    catch(e){
        res.status(500).send('please login')
    }

})
/////////////////////////////////////////////////////

// Delete profile

router.delete('/profile',auth,async(req,res)=>{
    try{
        await req.reporters.remove()
        res.send('profile was deleted')

    }catch(e){
        res.send(e)
    }

})
////////////////////////////////////////////////////////

// Update

router.patch('/profile', auth, async(req,res)=>{
    const updates = Object.keys(req.body) 
    console.log(updates)
    try{

        updates.forEach((update)=>(req.reporters[update]=req.body[update]))
        await req.reporters.save()
        
        res.status(200).send(req.reporters)
        
    }
    catch(e){
        res.status(400).send('Error has occured')
    }

})


module.exports = router
