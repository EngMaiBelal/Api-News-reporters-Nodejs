const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

// with schema
const reportersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is required')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Change Your Password ')    
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})
/////////////////////////////////////////////////////////////////////////

// Relation

reportersSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
  })

///////////////////////////////////////////////////////////////////////////

// middleWare

reportersSchema.pre('save',async function(next){
    const reporters = this
    console.log(reporters)
    if(reporters.isModified('password')){
        reporters.password = await bcrypt.hash( reporters.password,8)
    }
  
    next()

})
///////////////////////////////////////////////////////////////////


reportersSchema.statics.findByCredentials = async(email,password)=>{
    
    const  reporters = await Reporters.findOne({email})
    if(!reporters){
        throw new Error('Email is incorrect')
    }
    const isMatch = await bcrypt.compare(password, reporters.password)
    if(!isMatch){
        throw new Error('password is incorrect')
    }
    return  reporters
}
//////////////////////////////////////////////////////////////////////


reportersSchema.methods.generateToken = async function(){
    const reporters = this
    const token = jwt.sign({_id:reporters._id.toString()},'node course' ,{expiresIn:'6 days'})
    reporters.tokens = reporters.tokens.concat({token})
    await reporters.save()

    return token
}

///////////////////////////////////////////////////////////////////////////////////////

reportersSchema.methods.toJSON =function(){
    const reporters =this
    const reportersObject = reporters.toObject()
    delete reportersObject.password
    delete reportersObject.tokens

    return reportersObject
}


const Reporters = mongoose.model('Reporters',reportersSchema);
module.exports = Reporters