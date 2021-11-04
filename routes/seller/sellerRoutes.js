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
const allPendingOrders = require('../../controllers/seller/getAllPendingOrdersController')
const order = require('../../controllers/seller/getOrderByTrackingIdController')
const updateOrder = require('../../controllers/seller/updateOrderStatusController')
const completedOrders = require('../../controllers/seller/getCompletedOrdersController')
const singleOrder = require('../../controllers/seller/getSingleOrderController')
const addBankDetails = require('../../controllers/seller/addBankDetailsController')
const uploadDocs = require('../../controllers/seller/uploadVerificationDocsController')
const profile = require('../../controllers/seller/getSellerProfileController')
const orderItems = require('../../controllers/seller/getOrderItemsController')
const allOrders = require('../../controllers/seller/getAllOrdersController')
const bankDetails = require('../../controllers/seller/getBankDetailsController')
const updateProfile = require('../../controllers/seller/updateSellerProfile')
const updateProfileImage = require( '../../controllers/seller/updateProfileImage' )

router
  .route('/products/:catId')
  .get(authenticated('seller'), authRole('seller'), getAllProductsByCat)
router
  .route('/edit/:productId')
  .get(authenticated('seller'), authRole('seller'), editProduct)
  .put(authenticated('seller'), authRole('seller'), updateProduct)
  .delete(authenticated('seller'), authRole('seller'), deleteProduct)

router
  .route('/dashboard')
  .get(authenticated('seller'), authRole('seller'), dashboard)
router
  .route('/mostviewed/:categoryId?')
  .get(authenticated('seller'), authRole('seller'), mostViewed)
router
  .route('/bestselling')
  .get(authenticated('seller'), authRole('seller'), bestSelling)
router
  .route('/inventory')
  .get(authenticated('seller'), authRole('seller'), inventory)
router
  .route('/new-store')
  .post(authenticated('seller'), authRole('seller'), createStore)
router
  .route('/new-product')
  .post(authenticated('seller'), authRole('seller'), addProduct)
router.route('/categories').get(getAllCategory)

//orders
router
  .route('/order/:trackingId')
  .get(authenticated('seller'), authRole('seller'), order)

router
  .route('/orders')
  .get(authenticated('seller'), authRole('seller'), allOrders)
router
  .route('/orders/new')
  .get(authenticated('seller'), authRole('seller'), allPendingOrders)
router
  .route('/orders/completed')
  .get(authenticated('seller'), authRole('seller'), completedOrders)
router
  .route('/orders/:orderId/items')
  .get(authenticated('seller'), authRole('seller'), orderItems)

router
  .route('/orders/:orderId')
  .put(authenticated('seller'), authRole('seller'), updateOrder)
  .get(authenticated('seller'), authRole('seller'), singleOrder)

router
  .route('/bankdetails')
  .post(authenticated('seller'), authRole('seller'), addBankDetails)

//profile
router
  .route('/upload')
  .post(authenticated('seller'), authRole('seller'), uploadDocs)
router
  .route('/profile')
  .get(authenticated('seller'), authRole('seller'), profile)
  .put(authenticated('seller'),updateProfile)
router.route('/profile/image').put(authenticated('seller'),updateProfileImage)

//bank
router
  .route('/bank-details')
  .get(authenticated('seller'), authRole('seller'), bankDetails)
// router
//   .route('/create-order')
//   .post(authenticated, authRole('seller'), async (req, res) => {
//     const Order = require('../../models/orderModel')
//     req.body.store = req.store.id,
//     req.body.buyer = req.user.id

//     const order = await Order.create({
//       store:req.store.id,
// buyer:req.user.id,
// orderTotal: 5678,
// orderItems:[
//   {
//       "productId": "60f571e3cbfbe5c4de6f24b1",
//       "qty": 10
//   },
//   {
//       "productId": "60f57459cbfbe5c4de6f24ba",
//       "qty": 5
//   },
//   {
//       "productId": "60f57475cbfbe5c4de6f24bb",
//       "qty": 9
//   }
// ]
//    })

//     res.status(201).json({
//       status: 'success',
//       data: order,
//     })
//   })

module.exports = router
