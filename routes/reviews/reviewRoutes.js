const router = require('express').Router()
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const addReview = require('../../controllers/reviews/addReviewController')

router.route('/').post(authenticated, authRole('seller'), addReview)
module.exports = router
