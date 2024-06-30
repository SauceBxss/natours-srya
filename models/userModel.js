const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name:{
        type: String,
        required: true, 
        unique: false,
        trim: true,
        minlength: [3, 'Name {VALUE} must be atleast 3 characters'],
        maxlength: [25, 'Name {VALUE} must be atleast 25 characters'],
    },
    email:{
        type: String, 
        required: [true, 'An email is required '],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'The email is not a valid email']
    },
    photo:{
        type: String, 
        required: false,
        unique: false
    },
    password: {
        type: String, 
        required: true,
        unique: false,
        minLength: [8, 'Your password must be at least 8 characters long.'],
        maxLength: [60, 'Your password must not exceed 60 characters.'],
        trim: true,
        select: true
    },
    confirmPassword: {
        type: String, 
        required: true,
        unique: false,
        minLength: [8, 'Your password must be at least 8 characters long.'],
        maxLength: [60, 'Your password must not exceed 60 characters.'],
        validate: {
            validator: function (val){
                return val === this.password
            },
            message:"Passwords do not match!"
        },
        select: false
    }
},{autoIndex: true})

userSchema.set('toJSON', {
    versionKey: false
})



userSchema.pre('save',async function(next){

    if(!this.isModified('password')) return next()
    
    this.password = await bcrypt.hash(this.password, 12)
       // assigning the hash to this.passwds
    this.confirmPassword = undefined

})

// trying out instance method
userSchema.methods.isThisPasswordCorrect = async function(candidatePassword, hashedPassword){
    return await bcrypt.compare(candidatePassword, hashedPassword)
}
const User  = mongoose.model('User', userSchema)

module.exports = User