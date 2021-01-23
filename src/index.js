const express = require('express')
const newsRouter=require('./routers/news.js')
const reportersRouter=require('./routers/reporters.js')

require('./db/mongoose')

// intialize 
const app = express()
app.use(express.json())

app.use((req,res,next)=>{
    next()
})

app.use(newsRouter)
app.use(reportersRouter)


//declare to port
const port = 3000

app.listen(port,()=> console.log('server is running'))