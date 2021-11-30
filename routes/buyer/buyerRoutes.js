const router = require('express').Router()
const viewProduct = require('../../controllers/buyer/viewProductController')
const setSession = require('../../middleware/setSession')
const getAllProducts = require('../../controllers/buyer/getAllProductsController')

const search = require('../../middleware/search')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')

const Product = require('../../models/productModel')
const shop = require('../../controllers/buyer/shopPageController')
const mostViewedCategory = require('../../controllers/buyer/mostViewedCat')
const getCollections = require('../../controllers/buyer/getCollectionsController')
const topDeals = require('../../controllers/buyer/topDealsController')
const recommendedProducts = require('../../controllers/buyer/getRecommendedProductsController')
const allOrders = require('../../controllers/buyer/getAllOrdersController')
const singleOrder = require('../../controllers/buyer/getSingleOrderController')
const profile = require('../../controllers/buyer/getUserProfileController')
const updateProfile = require('../../controllers/buyer/updateProfileController')
const updateProfileImage = require('../../controllers/buyer/updateProfileImageController')
const points = require('../../controllers/buyer/getLoyalityPointsController')

router.route('/products/:productId').get(viewProduct)
router
  .route('/products')
  .get(search(Product, ['category', 'store']), getAllProducts)

router.route('/categories/most-viewed').get(mostViewedCategory)
router.route('/collections').get(getCollections)
router.route('/top-deals').get(topDeals)
router.route('/recommended-products').get(recommendedProducts)

//order
router
  .route('/orders')
  .get(authenticated('buyer'), authRole('buyer'), allOrders)
router
  .route('/orders/:orderId')
  .get(authenticated('buyer'), authRole('buyer'), singleOrder)

//profile
router
  .route('/profile')
  .get(authenticated('buyer'), authRole('buyer'), profile)
  .put(authenticated('buyer'), authRole('buyer'),updateProfile)

  router.route('/profile-image').put(authenticated('buyer'), authRole('buyer'),updateProfileImage)

  router.route('/loyality-points').get(authenticated('buyer'), authRole('buyer'), points)

module.exports = router
