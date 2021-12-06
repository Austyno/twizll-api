const router = require('express').Router()
const addReview = require('../../controllers/reviews/addReviewController')
const getReview = require('../../controllers/reviews/getASingleReviewController')
const getProductReview = require('../../controllers/reviews/getProductReviewsController')
const percentages = require('../../controllers/reviews/getPercentageReviewController')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')

router.route('/').post(authenticated('buyer'), authRole('buyer'), addReview)
router.route('/:reviewId').get(getReview)

router.route('/product/:product').get(getProductReview)
router.route('/:productId/percentage').get(percentages)

module.exports = router
