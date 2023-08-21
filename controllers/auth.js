const User= require('../Models/User')
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//Register user
// get /api/v1/auth/register
//public

exports.register =asyncHandler(async(req,res,next)=>{
    const {name,email,password,role} = req.body

    //create use
    const user = await User.create({name,email,password,role})

    res.status(200).json({
        success: true,
       data: user
    })
})