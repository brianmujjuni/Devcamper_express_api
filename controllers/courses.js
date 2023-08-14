const Course = require('../Models/Course')
const Bootcamp = require('../Models/Bootcamp')
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

//get all Courses
// GET /api/v1/courses/
// GET api/v1/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
       const courses = await Course.find({ bootcamp: req.params.bootcampId })

       return res.status(200).json({
        success:true,
        count: courses.length,
        data: courses
       })
    } else {
        res.status(200).json(res.advancedResults)
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

//get single course 
//GET /api/v1/course/:id
exports.getCourse = asyncHandler(async (req,res,next)=>{
   const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
   })

   if(!course){
    return next(new errorResponse(`No course with the id of ${req.params.id}`),404)

   }

   res.status(200).json({
    success: true,
    data: course
   })
})

//add a course
//POST /api/v1/bootcamps/:bootcampId/courses
//private
exports.addCourse = asyncHandler( async (req, res,next)=>{
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),404)
    }

    const course = await Course.create(req.body)
    res.status(200).json({
        success: true,
        data: course
    })

})

//update courses
// put /api/v1/courses/:id
//private
exports.updateCorse = asyncHandler( async (req,res,next)=>{
    let course = await Course.findById(req.params.id)

    if(!course){
        return next(
            new errorResponse(`No course with the id of ${re.params.id}`)
            , 404
        )
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body,{
        new: true, runValidators: true
    })  

    res.status(200).json({
        success: true,
        data: course
    })
})


exports.deleteCourse = asyncHandler(async (req,res,next)=>{
     const course = await Course.findById(req.params.id)
    if(!course){
        return next(
            new errorResponse(`No course with the id of ${re.params.id}`)
            , 404
        )
    }
    await course.deleteOne()
    res.status(200).json({
        success: true,
        data: course
    })
})