
const express = require('express')
const {getCourses, getCourse,addCourse,updateCorse,deleteCourse} = require('../controllers/courses')
const Course = require('../Models/Course')
const advancedRequest = require('../middleware/advancedRequest')

const router = express.Router({mergeParams: true})

router.route('/').get(advancedRequest(Course,{
    path: 'bootcamp',
    select: 'name description'
}),getCourses).post(addCourse)

router.route('/:id').get(getCourse).put(updateCorse).delete(deleteCourse)

module.exports = router