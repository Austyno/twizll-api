const router = require('express').Router()

const getAllProductsByCat = require('../../controllers/seller/getAllproductsByCatController')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const dashboard = require('../../controllers/seller/getDashboard')
const mostViewed = require('../../controllers/seller/mostViewedProducts')
const bestSelling = require('../../controllers/seller/bestSellingProducts')
const inventory = require('../../controllers/seller/getInventoryController')
const updateInventory = require('../../controllers/seller/updateInventoryController')
const createStore = require('../../controllers/seller/createStoreController')
const addProduct = require('../../controllers/seller/addProductsController')
const editProduct = require('../../controllers/seller/editProductController')
const updateProduct = require('../../controllers/seller/updateProductController')
const deleteProduct = require('../../controllers/seller/deleteProductController')
const getMainCategory = require('../../controllers/seller/getMainCategoryController')
const allPendingOrders = require('../../controllers/seller/getAllPendingOrdersController')
const order = require('../../controllers/seller/getOrderByTrackingIdController')
const updateOrder = require('../../controllers/seller/confirmOrderController')
const completedOrders = require('../../controllers/seller/getCompletedOrdersController')
const singleOrder = require('../../controllers/seller/getSingleOrderController')
const addBankDetails = require('../../controllers/seller/addBankDetailsController')
const uploadDocs = require('../../controllers/seller/uploadVerificationDocsController')
const profile = require('../../controllers/seller/getSellerProfileController')
const orderItems = require('../../controllers/seller/getOrderItemsController')
const allOrders = require('../../controllers/seller/getAllOrdersController')
const bankDetails = require('../../controllers/seller/getBankDetailsController')
const updateProfile = require('../../controllers/seller/updateSellerProfile')
const updateProfileImage = require('../../controllers/seller/updateProfileImage')
const contactUs = require('../../controllers/seller/contactUsController')
const updateStore = require('../../controllers/seller/updateStoreController')
const uploadLogo = require('../../controllers/seller/uploadStoreLogoController')
const getCountries = require('../../controllers/seller/getAllCountries')

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
  .route('/inventory/:productId?')
  .get(authenticated('seller'), authRole('seller'), inventory)
  .put(authenticated('seller'), authRole('seller'), updateInventory)

router
  .route('/new-product')
  .post(authenticated('seller'), authRole('seller'), addProduct)
router.route('/categories/main').get(getMainCategory)

//store
router
  .route('/new-store')
  .post(authenticated('seller'), authRole('seller'), createStore)
  .put(authenticated('seller'), authRole('seller'), updateStore)

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
  .put(authenticated('seller'), updateProfile)
router.route('/profile/image').put(authenticated('seller'), updateProfileImage)

router.route('/contact-us').post(contactUs)

//bank
router
  .route('/bank-details')
  .get(authenticated('seller'), authRole('seller'), bankDetails)

router
  .route('/store-logo')
  .post(authenticated('seller'), authRole('seller'), uploadLogo)

router.route('/countries').get(getCountries)

// router
//   .route('/create-order')
//   .post(authenticated('seller'), authRole('seller'), async (req, res) => {
//     const Order = require('../../models/orderModel')
//     const OrderItem = require('../../models/orderItems')
//     req.body.buyer = req.user.id
//     const items = [
//       {
//         productId: '60f571e3cbfbe5c4de6f24b1',
//         qty: 10,
//         unitPrice: 25,
//       },
//       {
//         productId: '60f57459cbfbe5c4de6f24ba',
//         qty: 5,
//         unitPrice: 9,
//       },
//     ]
//     // orderID
//     // productID
//     // totalPrice
//     // discountedPrice
//     // quantity
//     // status
//     const order = await Order.create({
//       buyer: req.user.id,
//     })
//     let itemArr = []
//     let orderTotal = 0

//     for (let i = 0; i < items.length; i++) {
//       const newItem = await OrderItem.create({
//         orderId: order.id,
//         productId: items[i].productId,
//         totalPrice: items[i].qty * items[i].unitPrice,
//         quantity: items[i].qty,
//       })
//       itemArr.push(newItem.id)
//       orderTotal += Number(newItem.totalPrice)
//     }
//     order.orderItems = itemArr
//     order.orderTotal = orderTotal
//     order.save({ validateBeforeSave: false })

//     res.status(201).json({
//       status:"success",
//       message:"order crested successfully",
//       data:order
//     })

//   })

module.exports = router
