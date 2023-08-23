
const express = require('express')
const {getCourses, getCourse,addCourse,updateCorse,deleteCourse} = require('../controllers/courses')
const Course = require('../Models/Course')
const advancedRequest = require('../middleware/advancedRequest')

const router = express.Router({mergeParams: true})

const { protect,authorize} = require('../middleware/auth')

router.route('/').get(advancedRequest(Course,{
    path: 'bootcamp',
    select: 'name description'
}),getCourses).post(protect,authorize('publisher','admin'),addCourse)

router.route('/:id').get(getCourse).put(protect,authorize('publisher','admin'),updateCorse).delete(protect,authorize('publisher','admin'),deleteCourse)

module.exports = router