const express = require('express')
const {getUsers,getUser,createUsers,deleteUser,UpdateUser} = require('../controllers/users')
const User = require('../Models/User')
const advancedResults = require('../middleware/advancedRequest')

const router = express.Router({mergeParams: true})
const {protect, authorize} = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User),getUsers).post(createUsers)
router.route('/:id').get(getUser).put(UpdateUser).delete(deleteUser)


module.exports = router
