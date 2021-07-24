const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')

const updateOrder = async (req, res, next) => {
  const { orderId } = req.params
  const { orderStatus } = req.body
  const seller = req.user
  const sellerStore = req.store
  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  const orderExist = await Order.findById(orderId)

  if (!orderExist) {
    return next(new Error('this order does not exist', 404))
  }

  try {
    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    )
    res.status(200).json({
      status: 'success',
      message: 'order status updated successfully',
      data: updateOrder,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = updateOrder
