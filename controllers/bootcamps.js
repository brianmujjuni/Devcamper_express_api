const Bootcamp = require('../Models/Bootcamp')
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
        res.status(400).json({ success: false })
    }

}

// @desc get single bootcamps
// @route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootCamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
           return res.status(400).json({ success: false })
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        // res.status(400).json({success:false})
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
        res.status(400).json({
            success: false,

        })
    }

}

// @desc update  bootcamps
// @route Put /api/v1/bootcamps/:id
//@access Private
exports.updateBootCamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
           runValidators: true
       })
       if(!bootcamp){
           return res.status(400).json({success: false})
       }
   
       res.status(200).json({
           success:true,
           data: bootcamp
       })
    } catch (error) {
        res.status(400).json({success: false})
    }
    
}

// @desc delete bootcamps
// @route Delete /api/v1/bootcamps/:id
//@access Private
exports.deleteBootCamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
       if(!bootcamp){
           return res.status(400).json({success: false})
       }
   
       res.status(200).json({
           success:true,
           data: {}
       })
    } catch (error) {
        res.status(400).json({success: false})
    }
}