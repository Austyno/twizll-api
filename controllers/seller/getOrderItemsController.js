const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')
const Order = require('../../models/orderModel')
const OrderItem = require('../../models/orderItem')
const Product = require('../../models/productModel')

const orderItems = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  const { orderId } = req.params

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 403))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  const orderExist = await Order.findById(orderId)

  if (!orderExist) {
    return next(new Error('This order does not exist', 400))
  }

  try {
    const products = []
    const orderItems = await OrderItem.find({
      $and: [{ orderId }, { status: 'new' }],
    })

    for (let i = 0; i < orderItems.length; i++) {
      const getProduct = await Product.findById(orderItems[i].product)

      products.push(getProduct)
    }

    const loggedInUserProducts = products.filter(
      item => {
        if(item != null){
          return item.store == sellerStore.id
        }
      }
    )

    res.status(200).json({
      status: 'success',
      message: 'order items retrieved',
      data: loggedInUserProducts,
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}
module.exports = orderItems
