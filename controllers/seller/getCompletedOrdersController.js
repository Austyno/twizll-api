const Order = require('../../models/orderModel')
const Product = require('../../models/productModel')
const OrderItem = require('../../models/orderItem')


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

    const products = []
    const orderItems = await OrderItem.find({ status: 'completed' })

    for (let i = 0; i < orderItems.length; i++) {
      const getProduct = await Product.findById(orderItems[i].product)

      products.push(getProduct)
    }

    const loggedInUserProducts = products.filter(item => item.store == sellerStore.id)

    res.status(200).json({
      status: 'success',
      message: 'completed orders retrieved',
      data: loggedInUserProducts,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = completedOrders
