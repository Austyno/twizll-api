const Order = require('../../models/orderModel')
const OrderItem = require('../../models/orderItem')
const Error = require('../../utils/errorResponse')
const Product = require('../../models/productModel')

const singleOrder = async (req, res, next) => {
  const { orderId } = req.params
  const buyer = req.user

  if (!buyer) {
    return next(
      new Error('You need to be logged in to perform this action', 403)
    )
  }
  try {
    const items = await OrderItem.find({orderId}).populate('product')

    res.status(200).json({
      status: 'success',
      message: 'order items retrieved',
      data: items
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = singleOrder
