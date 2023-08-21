
const express = require('express')
const {getBootCamps,getBootCamp,createBootCamp,deleteBootcamp,updateBootCamp,getBootCampInRadius,bootcampPhotoUpload} = require('../controllers/bootcamps')
//Include other resource routers
const courseRouter = require('./courses')
const Bootcamp = require('../Models/Bootcamp')
const advancedResults = require('../middleware/advancedRequest')


const router = express.Router()

const { protect } = require('../middleware/auth')

//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

router.route('/').get(advancedResults(Bootcamp, 'courses'),getBootCamps).post(protect ,createBootCamp)

router.route('/:id').get(getBootCamp).put(protect,updateBootCamp).delete(protect, deleteBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)
 
router.route('/:id/photo').put(protect ,bootcampPhotoUpload)

module.exports = router