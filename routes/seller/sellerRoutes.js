const router = require('express').Router()

const getAllProductsByCat = require('../../controllers/seller/getAllproductsByCatController')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const dashboard = require('../../controllers/seller/getDashboard')
const mostViewed = require('../../controllers/seller/mostViewedProducts')
const bestSelling = require('../../controllers/seller/bestSellingProducts')
const inventory = require('../../controllers/seller/getInventoryController')

router
  .route('/products/:catId')
  .get(authenticated, authRole('seller'), getAllProductsByCat)

router.route('/dashboard').get(authenticated, authRole('seller'), dashboard)
router.route('/mostviewed').get(authenticated, authRole('seller'), mostViewed)
router.route('/bestselling').get(authenticated, authRole('seller'), bestSelling)
router.route('/inventory').get(authenticated, authRole('seller'), inventory)

module.exports = router
