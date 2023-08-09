const Bootcamp = require('../Models/Bootcamp')
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const { json } = require('express')
const { param } = require('../routes/bootcamps')
// @desc get all bootcamps

// @route Get /api/v1/bootcamps
//@access Public
exports.getBootCamps = asyncHandler(
    async (req, res, next) => {

        let query

        //copy req.query
        const reqQuery ={...req.query}

        // Fields to exclude 
        const removeFields = ['select','sorting','page','limit']

        //loop over removedFields and delete them from query
        removeFields.forEach(param =>delete reqQuery[param])

        //Create query string
        let queryStr = JSON.stringify(reqQuery)

        //create operators
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        //Finding resource
        query = Bootcamp.find(JSON.parse(queryStr))

        //select fields
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        }else{
            query = query.sort('-createdAt')
        }
        //pagination 
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit,10) || 100
        const skip = (page - 1) * limit

        query = query.skip(skip).limit(limit)

        //excuting the quer
        const bootcamps = await query

        res.status(200).json({
            success: true,
            count: bootcamps.length,
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

        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }

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