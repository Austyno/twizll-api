const router = require('express').Router()
const viewProduct = require('../../controllers/buyer/viewProductController')
const setSession = require('../../middleware/setSession')
const getAllProducts = require('../../controllers/buyer/getAllProductsController')

const search = require('../../middleware/search')
const Product = require('../../models/productModel')
const shop = require('../../controllers/buyer/shopPageController')
const mostViewedCategory = require('../../controllers/buyer/mostViewedCat')
const getCollections = require('../../controllers/buyer/getCollectionsController')
const topDeals = require('../../controllers/buyer/topDealsController')
const recommendedProducts = require( '../../controllers/buyer/getRecommendedProductsController' )

router.route('/products/:productId').get(viewProduct)
router
  .route('/products')
  .get(search(Product, ['category', 'store']), getAllProducts)

router.route('/categories/most-viewed').get(mostViewedCategory)
router.route('/collections').get(getCollections)
router.route('/top-deals').get(topDeals)
router.route('/recommended-products').get(recommendedProducts)
module.exports = router
