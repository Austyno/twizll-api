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
const getCollections = require('../../controllers/stylist/getCollectionsController')
const topDeals = require('../../controllers/buyer/topDealsController')
const recommendedProducts = require('../../controllers/buyer/getRecommendedProductsController')
const allOrders = require('../../controllers/buyer/getAllOrdersController')
const singleOrder = require('../../controllers/buyer/getSingleOrderController')
const profile = require('../../controllers/buyer/getUserProfileController')
const updateProfile = require('../../controllers/buyer/updateProfileController')
const updateProfileImage = require('../../controllers/buyer/updateProfileImageController')
const points = require('../../controllers/buyer/getLoyalityPointsController')
const shipping = require('../../controllers/buyer/addShippingAddressController')
const collectionCat = require('../../controllers/buyer/getCollectionCategoryController')
const collectionCatProducts = require('../../controllers/buyer/getCollectionCategoryProductsController')
const favourite = require('../../controllers/buyer/favouritesController')
const getFav = require('../../controllers/buyer/getFavouritesController')

router.route('/products/:productId').get(viewProduct)
router
  .route('/products')
  .get(search(Product, ['category', 'store']), getAllProducts)

router.route('/categories/most-viewed').get(mostViewedCategory)
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
  .put(authenticated('buyer'), authRole('buyer'), updateProfile)

router
  .route('/profile-image')
  .put(authenticated('buyer'), authRole('buyer'), updateProfileImage)

// loyality
router
  .route('/loyality-points')
  .get(authenticated('buyer'), authRole('buyer'), points)

// shipping address
router
  .route('/shipping-address')
  .post(authenticated('buyer'), authRole('buyer'), shipping)

router.route('/collection-cat/:collectionId').get(collectionCat)
router.route('/collection-cat-products/:categoryId').get(collectionCatProducts)
router.route('/favourites').post(authenticated('buyer'), authRole('buyer'),favourite)
router
  .route('/favourites')
  .post(authenticated('buyer'), authRole('buyer'), favourite)
  .get(authenticated('buyer'), authRole('buyer'),getFav)


module.exports = router
