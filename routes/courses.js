
const express = require('express')
const {getCourses, getCourse,addCourse,updateCorse,deleteCourse} = require('../controllers/courses')

const router = express.Router({mergeParams: true})

router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourse).put(updateCorse).delete(deleteCourse)

module.exports = router