const express = require('express')

const {getReviews} = require('../controllers/reviews')         
const Review = require('../Models/Review')    
const router = express.Router({mergeParams: true})    

const advancedResults = require('../middleware/advancedRequest')
const {protect,authorize} = require('../middleware/auth')

router.route('/').get(advancedResults(Review,{path:'bootcamp',select:'name description'}),getReviews)

module.exports = router