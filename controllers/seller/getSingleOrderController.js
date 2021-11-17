const Product = require('../../models/productModel')
const OrderItem = require('../../models/orderItem')
const Order = require('../../models/orderModel')

const Error = require('../../utils/errorResponse')


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
    // const products = []
    // const orderItems = await OrderItem.find({ orderId })

    // for (let i = 0; i < orderItems.length; i++) {
    //   const getProduct = await Product.findById(orderItems[i].product)

    //   products.push(getProduct)
    // }

    // const loggedInUserProducts = products.filter(
    //   item => {
    //     if(item != null){
    //       return item.store == sellerStore.id
    //     }
    //   }
    // )

    const order = await Order.findById(orderId)


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
