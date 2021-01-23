const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
    // imageNews:[{ 
    //  image:{
    //     type: Buffer
    // }
    // }],
    imageNews:{
        type: Buffer
    },
    title:{
        type: String,
        required: true,
        unique: true,

    },
    description:{
        type: String,
        required: true
    },
    auther:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporters'
    }
},{
    timestamps:true
})


// var dt=new Date()
// dt.setHours(dt.getHours()+2)
// console.log(dt)


//var now=Date.now();
// var x=now.addHours(2)
// Date.prototype.addHours=function(h){
//     this.setTime(this.getTime()+(h))
//     return this
// }
const News = mongoose.model('News',newsSchema)
module.exports = News