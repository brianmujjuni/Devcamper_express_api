
const express = require('express')
const {getCourses, getCourse,addCourse,updateCorse,deleteCourse} = require('../controllers/courses')
const Course = require('../Models/Course')
const advancedRequest = require('../middleware/advancedRequest')

const router = express.Router({mergeParams: true})

const { protect } = require('../middleware/auth')

router.route('/').get(advancedRequest(Course,{
    path: 'bootcamp',
    select: 'name description'
}),getCourses).post(protect,addCourse)

router.route('/:id').get(getCourse).put(protect,updateCorse).delete(protect,deleteCourse)

module.exports = router