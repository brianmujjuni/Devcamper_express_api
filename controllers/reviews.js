
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