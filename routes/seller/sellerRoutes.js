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

router
  .route('/products/:catId')
  .get(authenticated, authRole('seller'), getAllProductsByCat)
router
  .route('/edit/:productId')
  .get(authenticated, authRole('seller'), editProduct)
  .put(authenticated, authRole('seller'), updateProduct)
  .delete(authenticated, authRole('seller'), deleteProduct)


router.route('/dashboard').get(authenticated, authRole('seller'), dashboard)
router
  .route('/mostviewed/:categoryId?')
  .get(authenticated, authRole('seller'), mostViewed)
router.route('/bestselling').get(authenticated, authRole('seller'), bestSelling)
router.route('/inventory').get(authenticated, authRole('seller'), inventory)
router.route('/new-store').post(authenticated, authRole('seller'), createStore)
router.route('/new-product').post(authenticated, authRole('seller'), addProduct)
router
  .route('/categories')
  .get(authenticated, authRole('seller'), getAllCategory)

  //orders
  router
    .route('/order/:trackingId')
    .get(authenticated, authRole('seller'), order)

    router.route('/orders').get(authenticated, authRole('seller'),allOrders)
router
  .route('/orders/new')
  .get(authenticated, authRole('seller'), allPendingOrders)
router
  .route('/orders/completed')
  .get(authenticated, authRole('seller'), completedOrders)
  router
    .route('/orders/:orderId/items')
    .get(authenticated, authRole('seller'), orderItems)

    router
      .route('/orders/:orderId')
      .put(authenticated, authRole('seller'), updateOrder)
      .get(authenticated, authRole('seller'), singleOrder)


router
  .route('/bankdetails')
  .post(authenticated, authRole('seller'), addBankDetails)

  //profile
router.route('/upload').post(authenticated, authRole('seller'), uploadDocs)
router.route('/profile').get(authenticated, authRole('seller'), profile)
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
