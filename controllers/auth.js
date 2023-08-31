const User = require('../Models/User')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

//Register user
// post /api/v1/auth/register
//public

exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    //create use
    const user = await User.create({ name, email, password, role })

    // //create token 
    // const token = user.getSignedJWTToken()

    // res.status(200).json({
    //     success: true,
    //     data: user,
    //     token: token
    // })
    sendTokenResponse(user, 200, res)
})

//Login user
//public 
//api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    //validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide a valaid email and password', 400))
    }
    //check for user
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid crendetial', 401))
    }

    //check if password matches
    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return next(new ErrorResponse('Invalid crendetial', 401))
    }

    // //create token 
    // const token = user.getSignedJWTToken()

    // res.status(200).json({
    //     success: true,
    //     token: token
    // })

    sendTokenResponse(user, 200 ,res)
})



//get current loged in user
// Post /api/v1/auth/me
//access Private

exports.getMe = asyncHandler(async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc Forgot password
//@route Post /api/v1/auth/forgotpassword
//@acess Public
exports.forgotPassword = asyncHandler(async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next(new ErrorResponse('There is no user with that email', 404))
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();
    
    res.status(200).json({
        success: true
    })
})

//get token from model,create cookie and send response
const sendTokenResponse = (user,statusCode,res)=>{
    //create token 
    const token = user.getSignedJWTToken()

    const options ={
       expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
       httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
       options.secure = true
    }

    res.status(statusCode).
    cookie('token',token,options).
    json({
       success: true,
       token
    })
}