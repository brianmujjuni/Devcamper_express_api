
const express = require('express')
const {getBootCamps,getBootCamp,createBootCamp,deleteBootCamp,updateBootCamp,getBootCampInRadius,bootcampPhotoUpload} = require('../controllers/bootcamps')
//Include other resource routers
const courseRouter = require('./courses')

const router = express.Router()

//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

router.route('/').get(getBootCamps).post(createBootCamp)

router.route('/:id').get(getBootCamp).put(updateBootCamp).delete(deleteBootCamp)

router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)
 
router.route('/:id/photo').put(bootcampPhotoUpload)

module.exports = router