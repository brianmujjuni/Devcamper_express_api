
const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.status(200).json({success: true,msg: 'Show all botcamps'});
})

router.post('/',(req,res)=>{
    res.status(200).json({success: true,msg: 'Create new botcamps'});
})

router.put('/:id',(req,res)=>{
    res.status(200).json({success: true,msg: `Update botcamp ${req.params.id}`});
})
router.get('/:id',(req,res)=>{
    res.status(200).json({success: true,msg: `Show botcamp ${req.params.id}`});
})

router.delete('/:id',(req,res)=>{
    res.status(200).json({success: true,msg: `Delete botcamp ${req.params.id}`});
})

module.exports = router