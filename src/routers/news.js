const express = require('express')
const router= new express.Router()
const News = require('../models/news') //model
const auth=require('../middleware/auth.js')
const multer = require('multer')

////////////////////////////////////////////////////////////////////////////////

// Post //Relation
router.post('/news',auth,async (req,res)=>{
    const news = new News({
        // spread operator -->     
        ...req.body,
        owner:req.reporters._id,
        
    })
    try{
        await news.save()
        res.status(200).send(news)
    }catch(error){
        res.status(400).send(error)
    }
})

////////////////////////////////////////////////////////////////////

//Get by id

router.get('/news/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOne({_id,owner:req.reporters._id})       
            if(!news){
                return res.status(400).send('unable to send reporters')
            }
            res.send(news)
    
    }catch(e){
        res.status(500).send('internal server error')
    }

})

////////////////////////////////////////////////////////////////

// Update by Id
 
router.patch('/news/:id',auth ,async(req,res)=>{
    const _id=req.params.id
    const updates = Object.keys(req.body)
    console.log(updates)
    try{
       
        const news = await News.findOne({_id,owner:req.reporters._id})

        if(!news){
            return res.send('no news found')
        }
        updates.forEach((update)=>news[update]=req.body[update])
        await news.save()
        res.status(200).send(news)
        
    }catch(e){
        // res.status(400).send('Error has occured')
        res.status(400).send(e)

    }
})

//////////////////////////////////////////////////////////////

// Delete by Id

router.delete('/news/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const news = await News.findOneAndDelete({_id,owner:req.reporters._id})

        if(!news){
            return res.send('no news found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})


///////////////////////////////////////////////////////////////
// Filter

router.get('/news',auth,async(req,res)=>{
    try{
        // // match
        // const match = {}
        // if(req.query.complated){
        //     match.complated = req.query.complated === 'true'
        // }
        // sort by dynamic
        const sort = {}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
        }
        await req.reporters.populate({
            path:'news',
            // match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort:sort
            }
        })
        .execPopulate()
        res.send(req.reporters.news)
    }catch(e){
        res.status(500).send(e)
    }
    })
///////////////////////////////////////////
//image router

// router.post('/news/imageNews',auth,uploads.single('imageNews'),async(req,res)=>{
//     try{

//         req.news.imageNews = req.file.buffer
//         await req.news.save()
//         req.send()
//     }catch(e){
//         res.send(e)
//     }
// })



////////////////////////////////////////////////////////

// upload image

const uploads = multer({
        limits:{
            fileSize:1000000 //byte
        },
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
                return cb(new Error('please enter image'))
            }
            cb(undefined,true)
        }
    })
router.post('/news/imageNews/:id',auth,uploads.single('imageNews'),async (req,res)=>{
    const _id=req.params.id
    try{
        const news = await News.findOne({_id,owner:req.reporters._id})       
        if(!news){
            return res.status(400).send('unable to send reporters')
            }
        news.imageNews = req.file.buffer
        // news.imageNews.push(req.file.buffer)

        await news.save()
        res.status(200).send(news)
        }catch(e){
            res.status(400).send('upload image')
        }
    }) 

    

module.exports = router