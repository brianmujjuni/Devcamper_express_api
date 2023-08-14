const User= require('../Models/User')
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//Register user
// get /api/v1/auth/register
//public

exports.register =asyncHandler(async(req,res,next)=>{
    res.status(200).json({
        success: true
    })
})