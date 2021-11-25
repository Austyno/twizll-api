const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')
const Order = require('../../models/orderModel')
const OrderItem = require('../../models/orderItem')
const Product = require('../../models/productModel')

const confirmOder = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  const { productId, status } = req.body
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
    // const products = []
    const orderItem = await OrderItem.findOneAndUpdate(
      {
        $and: [{ orderId }, { product:productId }],
      },
      {$set: { status }}
    )

    res.status(200).json({
      status: 'success',
      message: 'order item updated successfully',
      data: '',
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}
module.exports = confirmOder
