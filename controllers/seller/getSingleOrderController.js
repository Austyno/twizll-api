const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')

//TODO:refactor to make only one query instead of 2 (use advanced populate)
const singleOrder = async (req, res, next) => {
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
    const order = await Order.find({
      $and: [{ store: sellerStore.id }, { _id: orderId }],
    }).populate('buyer','email fullName address')


    res.status(200).json({
      status: 'success',
      message: 'order retrieved successfully',
      data: order,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = singleOrder
