const Course = require('../Models/Course')
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//get all Courses
// GET /api/v1/courses/
// GET api/v1/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler(async(req,res,next)=>{
    let query;

    if(req.params.bootcampId){
       query = Course.find({bootcamp: req.params.bootcampId}) 
    }else{
        query = Course.find()
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})