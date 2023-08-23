
const express = require('express')
const {getBootCamps,getBootCamp,createBootCamp,deleteBootcamp,updateBootCamp,getBootCampInRadius,bootcampPhotoUpload} = require('../controllers/bootcamps')
//Include other resource routers
const courseRouter = require('./courses')
const Bootcamp = require('../Models/Bootcamp')
const advancedResults = require('../middleware/advancedRequest')


const router = express.Router()

const { protect,authorize } = require('../middleware/auth')

//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

router.route('/').get(advancedResults(Bootcamp, 'courses'),getBootCamps).post(protect,authorize('publisher','admin') ,createBootCamp)

router.route('/:id').get(getBootCamp).put(protect,authorize('publisher','admin'),updateBootCamp).delete(protect,authorize('publisher','admin'), deleteBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)
 
router.route('/:id/photo').put(protect,authorize('publisher','admin') ,bootcampPhotoUpload)

module.exports = router