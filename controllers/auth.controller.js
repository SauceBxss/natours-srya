const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchEveryErrorsInAsyncCode = require('../utils/catchErrorsInEveryRoute')
const AppError = require('../utils/AppError')
const {promisify} = require('util')
//jwt signing
const createToken = (id)=>{
    return jwt.sign({mongoUserId: id}, process.env.JWT_SECRET, {
            //options section
            expiresIn: process.env.JWT_EXPIRY_TIME
        })
}

const signup = catchEveryErrorsInAsyncCode(async (req, res) => {

        const signUpDetails = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })

        //creating a jwt token / or signing.
        const token = createToken(signUpDetails._id)

        res.status(201).json({
            status: 'success',
            message: 'Signup successful!',
            token,
            data: {
                signUpDetails
            }
        })
    }
   )


const login = catchEveryErrorsInAsyncCode (async(req, res,next) => {
    const {email, password} = req.body

    //check if email and password exists
    if(!email || !password){
        return next(new AppError('Please enter an email or password', 400))
    }
    // if user exists then check password
    const user = await User.findOne({email}).select({password: 1})
    console.log(user)

    const correctDetails = await user.isThisPasswordCorrect(req.body.password, user.password)
    // check for validity now after gettingh all the details
    if(!user || !correctDetails) return next(new AppError('Incorrect Email or Password! Try Again.'))
            //send back token to user if all good
        const token = createToken(user._id)
            res.status(200).json({
            status: 'success',
            message: 'Login successful!',
            token,
            data: {
                user
            }
        })

})



// for protected routes (making middleware for accessing tours)
const protect = catchEveryErrorsInAsyncCode( async (req, res, next)=>{
    let tokenFromHeader;
    //? 1) get the token and check if exists
    // check if headers exist and the token has 'Bearer' as the starting word
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         tokenFromHeader = req.headers.authorization.split(' ')[1]
        console.log('tokenFromHeader:', tokenFromHeader)
    }
    //check if token exist
    if(!tokenFromHeader){
        return next(new AppError('No token found. Login is unsuccessful, try again', 401))
    }

    //? 2) validate/verify it if its correct by jwt.verify()

    //using node's promisify to make the 'createToken' function async
    const promisifiedToken = promisify(jwt.verify)
    const decodedToken = await promisifiedToken(tokenFromHeader, process.env.JWT_SECRET)
    console.log(decodedToken)

    //3) then check if the user exists
    
    //4) then check if user changed the password after jwt token was issued
    
    
    // if all correct, then only call next
    next()
})



module.exports = {signup, login, protect}