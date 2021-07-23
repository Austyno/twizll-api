const router = require('express').Router()

const getAllProductsByCat = require('../../controllers/seller/getAllproductsByCatController')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const dashboard = require('../../controllers/seller/getDashboard')
const mostViewed = require('../../controllers/seller/mostViewedProducts')
const bestSelling = require('../../controllers/seller/bestSellingProducts')
const inventory = require('../../controllers/seller/getInventoryController')
const createStore = require('../../controllers/seller/createStoreController')
const addProduct = require('../../controllers/seller/addProductsController')
const editProduct = require('../../controllers/seller/editProductController')
const updateProduct = require('../../controllers/seller/updateProductController')
const deleteProduct = require('../../controllers/seller/deleteProductController')
const getAllCategory = require('../../controllers/seller/getAllCategoryController')
const allOrders = require('../../controllers/seller/getAllOrdersController')
const order = require('../../controllers/seller/getOrderByTrackingIdController')

router
  .route('/products/:catId')
  .get(authenticated, authRole('seller'), getAllProductsByCat)
router
  .route('/edit/:productId')
  .get(authenticated, authRole('seller'), editProduct)
  .put(authenticated, authRole('seller'), updateProduct)
  .delete(authenticated, authRole('seller'), deleteProduct)

router.route('/dashboard').get(authenticated, authRole('seller'), dashboard)
router.route('/mostviewed').get(authenticated, authRole('seller'), mostViewed)
router.route('/bestselling').get(authenticated, authRole('seller'), bestSelling)
router.route('/inventory').get(authenticated, authRole('seller'), inventory)
router.route('/new-store').post(authenticated, authRole('seller'), createStore)
router.route('/new-product').post(authenticated, authRole('seller'), addProduct)
router.route('/category').get(authenticated, authRole('seller'), getAllCategory)
router.route('/orders').get(authenticated, authRole('seller'), allOrders)
router.route('/order/:trackingId').get(authenticated, authRole('seller'), order)
// router
//   .route('/create-order')
//   .post(authenticated, authRole('seller'), async (req, res) => {
//     const Order = require('../../models/orderModel')

//     const order = await Order.create(req.body)

//     res.status(201).json({
//       status: 'success',
//       data: order,
//     })
//   })

module.exports = router
