const Bootcamp = require('../Models/Bootcamp')
const errorResponse = require('../utils/errorResponse')
// @desc get all bootcamps

// @route Get /api/v1/bootcamps
//@access Public
exports.getBootCamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
    } catch (error) {
        next(error)
    }

}

// @desc get single bootcamps
// @route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootCamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        next(error)

    }

}

// @desc create new bootcamps
// @route Post /api/v1/bootcamps
//@access Private
exports.createBootCamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        next(error)
    }

}

// @desc update  bootcamps
// @route Put /api/v1/bootcamps/:id
//@access Private
exports.updateBootCamp = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error)
    }

}

// @desc delete bootcamps
// @route Delete /api/v1/bootcamps/:id
//@access Private
exports.deleteBootCamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }

        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        next(error)
    }
}