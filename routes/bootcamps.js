
const express = require('express')
const {getBootCamps,getBootCamp,createBootcamp,deleteBootCamp,updateBootCamp} = require('../controllers/bootcamps')

const router = express.Router()

router.route('/').get(getBootCamps).post(createBootcamp)

router.route('/:id').get(getBootCamp).put(updateBootCamp).delete(deleteBootCamp)



module.exports = router