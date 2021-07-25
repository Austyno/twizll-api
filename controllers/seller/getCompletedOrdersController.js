const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')

const completedOrders = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }
  try {
    const orders = await Order.find({
      $and: [{ store: sellerStore._id }, { orderStatus: 'delivered' }],
    })
    res.status(200).json({
      status: 'success',
      message: 'completed orders retrieved',
      data: orders,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = completedOrders
