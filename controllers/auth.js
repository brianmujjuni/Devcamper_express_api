const User = require('../Models/User')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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

//@desc update user details
// Put /api/v1/auth/updatedetails
//access Private

exports.updateDetails = asyncHandler(async(req,res,next)=>{
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,
        {new: true,runValidators: true})
        
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

    await user.save({validateBeforeSave: false})

    //Create reset url
    const resetUrl = `${req.protocal}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    const message = `You are recieving this email beacause you or some else has requested the reset of a password.Please
    make a PUT request to: \n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })

        res.status(200).json({success: true,msg: 'Email sent'})
    } catch (error) {
        console.log(error)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false})

        return next(new ErrorResponse('Email could not be sent', 500))
    }
   
})

//@desc Reset password
//route PUT /api/v1/auth/resetpassword/:resetttoken
//@access Public
exports.resetPassword = asyncHandler(async(req,res,next)=>{
    //get hashed token
    const resetPasswordToken = crypto.createHash('sha256').
    update(req.params.resettoken).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorResponse('Invalid Token', 400)) 
    }

    //set the new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponse(user, 200 ,res)

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