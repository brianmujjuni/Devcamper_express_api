const express = require('express')

const { register,login,getMe,forgotPassword,resetPassword,updateDetails,updatepassword,logout} = require('../controllers/auth')

const router = express.Router()
const { protect } = require('../middleware/auth')

router.post('/register',register)
router.post('/login',login)
router.get('/me',protect,getMe)
router.put('/updatedetails',protect,updateDetails)
router.put('/updatepassword',protect,updatepassword)
router.post('/forgotpassword',forgotPassword)
router.put('/resetpassword/:resettoken',resetPassword)
router.get('/logout',protect,logout)

module.exports = router