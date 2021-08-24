const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')

const singleOrderItems = async (req, res, next) => {
  const { orderId } = req.params
  const seller = req.user
  const sellerStore = req.store
  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    const order = await Order.findOne({
      $and: [{ store: sellerStore.id }, { _id: orderId }],
    })


    res.status(200).json({
      status: 'success',
      count:order.orderItems.length,
      message: 'order items retrieved successfully',
      data: order.orderItems,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = singleOrderItems
