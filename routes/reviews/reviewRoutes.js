const router = require('express').Router()
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const addReview = require('../../controllers/reviews/addReviewController')
const getReview = require('../../controllers/reviews/getASingleReviewController')
const getProductReview = require('../../controllers/reviews/getProductReviewsController')

router.route('/').post(authenticated, authRole('seller'), addReview)
router.route('/:reviewId').get(getReview)

router.route('/product/:product').get(getProductReview)

module.exports = router
