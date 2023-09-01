
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Review = require('../Models/Review')
const Bootcamp = require('../Models/Bootcamp')

//get all Review
// GET /api/v1/reviews/
// GET api/v1/bootcamps/:bootcampId/reviews
exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
})

//get single Review
// GET /api/v1/reviews/

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!review){
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404))
    }
    res.status(200).json({
        success: true,
        data: review
    })
})

//@desc Add review
//@route POST /api/v1/bootcamps/:bootcampId/reviews
//@access Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp found with id ${req.params.bootcampId}`,404))
    }
    const review = await Review.create(req.body)
    res.status(201).json({
        success: true,
        data: review
    })
})