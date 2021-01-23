const mongoose= require('mongoose')

// creat connection

mongoose.connect('mongodb://127.0.0.1:27017/news',{
     useNewUrlParser: true, 
     useUnifiedTopology: true,
     useCreateIndex: true,
     useFindAndModify:false,
    });