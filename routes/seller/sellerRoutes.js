const router = require('express').Router()

const getAllProducts = require('../../controllers/seller/getAllproductsController')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const dashboard = require('../../controllers/seller/getDashboard')
const mostViewed = require('../../controllers/seller/mostViewedProducts')
const bestSelling = require('../../controllers/seller/bestSellingProducts')

router.route('/products').get(authenticated, authRole('seller'), getAllProducts)

router.route('/dashboard').get(authenticated, authRole('seller'), dashboard)
router.route('/mostviewed').get(authenticated, authRole('seller'), mostViewed)
router.route('/bestselling').get(authenticated, authRole('seller'), bestSelling)

module.exports = router
