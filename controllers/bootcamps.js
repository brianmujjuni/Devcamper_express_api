// @desc get all bootcamps
// @route Get /api/v1/bootcamps
//@access Public
exports.getBootCamps = (req,res,next) =>{
    res.status(200).json({success: true,msg: 'Show all botcamps'});
}

// @desc get single bootcamps
// @route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootCamp = (req,res,next) =>{
    res.status(200).json({success: true,msg: `Show botcamp ${req.params.id}`});
}

// @desc create new bootcamps
// @route Post /api/v1/bootcamps
//@access Private
exports.createBootCamp = (req,res,next) =>{
    res.status(200).json({success: true,msg: 'Create new botcamps'});
}

// @desc update  bootcamps
// @route Put /api/v1/bootcamps/:id
//@access Private
exports.updateBootCamp = (req,res,next) =>{
    res.status(200).json({success: true,msg: `Update botcamp ${req.params.id}`});
}

// @desc delete bootcamps
// @route Delete /api/v1/bootcamps/:id
//@access Private
exports.deleteBootCamp = (req,res,next) =>{
    res.status(200).json({success: true,msg: `Delete botcamp ${req.params.id}`});
}