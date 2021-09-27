const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')

/**
 * TODO::Refactor order model and extract order items to a model. 
 * This will handle the case of an order having different products 
 * that belong to different stores. when ccreating an order items, 
 * get the store the product belongs to and attache it to the orderitems for easy identification when checking out
 */

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
    const orders = await Order.find({ store: sellerStore.id })
      .populate('buyer', 'fullName address email phone')
      .populate('orderItems.productId', 'name unitPrice mainPhoto briefDetails')

    res.status(200).json({
      status: 'success',
      message: 'These are all your orders',
      data: orders,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = allOrders