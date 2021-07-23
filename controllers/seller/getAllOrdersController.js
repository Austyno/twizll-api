const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')

const allOrders = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    //get orders by store
    const orders = await Order.find({
      $and: [{ store: sellerStore.id }, { orderStatus: 'new' }],
    }).populate('buyer', 'fullName address email phone')

    res.status(200).json({
      status: 'success',
      message: 'These are all your new/unprocessed orders',
      data: orders,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = allOrders
