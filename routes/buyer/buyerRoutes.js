const router = require('express').Router()
const viewProduct = require('../../controllers/buyer/viewProductController')
const setSession = require('../../middleware/setSession')
const getAllProducts = require('../../controllers/buyer/getAllProductsController')

const search = require('../../middleware/search')
const Product = require('../../models/productModel')
const shop = require('../../controllers/buyer/shopPageController')

router.route('/products/:productId').get(viewProduct)
router
  .route('/products')
  .get(search(Product, ['category', 'store']), getAllProducts)

router.route('/shop').get(shop)

module.exports = router
