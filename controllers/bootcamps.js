const Bootcamp = require('../Models/Bootcamp')
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
// @desc get all bootcamps

// @route Get /api/v1/bootcamps
//@access Public
exports.getBootCamps = asyncHandler(
    async (req, res, next) => {

        const bootcamps = await Bootcamp.find()
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