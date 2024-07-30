const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to',url)
mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const numeroValidator = (luku) => {
    const parts = luku.split('-')
    if (parts.length !== 2) {
        return false
    }
    if (parts[0].length>3 || parts[0].length<2){
        return false
    }

    return true
}

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
        validate : {
            validator: numeroValidator,
            message: 'number is not valid, here is example of right way: 040-1234567'       
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)