const Bootcamp = require('../Models/Bootcamp')
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const { json } = require('express')
const { param } = require('../routes/bootcamps')
const path = require('path')
// @desc get all bootcamps

// @route Get /api/v1/bootcamps
//@access Public
exports.getBootCamps = asyncHandler(
    async (req, res, next) => {

        let query

        //copy req.query
        const reqQuery = { ...req.query }

        // Fields to exclude 
        const removeFields = ['select', 'sorting', 'page', 'limit']

        //loop over removedFields and delete them from query
        removeFields.forEach(param => delete reqQuery[param])

        //Create query string
        let queryStr = JSON.stringify(reqQuery)

        //create operators
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        //Finding resource
        query = Bootcamp.find(JSON.parse(queryStr))

        //select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }
        //pagination 
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 25
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const total = await Bootcamp.countDocuments()

        query = query.skip(startIndex).limit(limit)

        //excuting the quer
        const bootcamps = await query

        //pagination results
        const pagination = {}

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (endIndex > 0) {
            pagination.next = {
                page: page - 1,
                limit
            }
        }




        res.status(200).json({
            success: true,
            count: bootcamps.length,
            pagination,
            data: bootcamps
        })
    }
)

// @desc get single bootcamps
// @route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootCamp = asyncHandler(
    async (req, res, next) => {

        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    }
)

// @desc create new bootcamps
// @route Post /api/v1/bootcamps
//@access Private
// @desc create new bootcamps
// @route Post /api/v1/bootcamps
//@access Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data: bootcamp
    })

})

// @desc update  bootcamps
// @route Put /api/v1/bootcamps/:id
//@access Private
exports.updateBootCamp = asyncHandler(
    async (req, res, next) => {

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
    }

)
// @desc delete bootcamps
// @route Delete /api/v1/bootcamps/:id
//@access Private
exports.deleteBootCamp = asyncHandler(
    async (req, res, next) => {

      

        bootcamp.deleteOne()

        res.status(200).json({
            success: true,
            data: {}
        })

    }
)

// @desc get  bootcamps within radius
// @route GET /api/v1/bootcamps/RADIUS/:zipCode/:distance
//@access Private
exports.getBootCampInRadius = asyncHandler(
    async (req, res, next) => {

        const { zipcode, distance } = req.params


        //get lat/lg from geocoder
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude
        const lng = loc[0].longitude

        //calculate radius
        //divide distance by raius of the earth
        //Earth radius  = 3963 mi/ 6378 kilometers
        const radius = distance / 3963

        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        })

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })

    }
) 

//upload photo for bootcamp
exports.bootcampPhotoUpload = asyncHandler(async (req,res,next)=>{
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    if(!req.files){
        return next(new errorResponse(`Please upload a file`),400)
    }

   const file = req.files.file
   //Make sure the image is a photo
   if(!file.mimetype.startsWith('image')){
    return next(new errorResponse(`Please upload an image file`),400)
   }

   //CHECK FILE SIZE
   if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new errorResponse(`Please upload an image les than ${process.env.MAX_FILE_UPLOAD} `),400)
   }

   //Create custom filename
   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err =>{
    if(err){
        return next(new errorResponse(`Problem with file upload`),500)  
    }

    await Bootcamp.findByIdAndUpdate(req.params.id,{photo: file.name})

    res.status(200).json({
        success: true,
        data: file.name
    })
   })
})