const Order = require('../../models/orderModel')
const OrderItem = require('../../models/orderItem')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const _ = require('lodash')

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
    const products = []

    //get all order items with status new
    const orderItems = await OrderItem.find({ status: 'new' })

    //find the product from product collection so we can have access to store that owns product
    for (let i = 0; i < orderItems.length; i++) {
      const getProduct = await Product.findById(orderItems[i].product)
      products.push(getProduct)
    }

    // filter out products that belong to logged in store
    const userProducts = products.filter(item => {
      if (item != null) {
        return item.store == sellerStore.id
      }
    })

    let order = []

    //get the logged in store products from order items so we can have access to the order id
    for (let j = 0; j < userProducts.length; j++) {
      const item = await OrderItem.findOne({
        product: userProducts[j].id,
      }).populate('product')
      order.push(item)
    }

    // group by order id
    const result = _(order)
      .groupBy(x => x.orderId)
      .map((value, key) => ({ orderId: key, products: value }))
      .value()

    res.status(200).json({
      status: 'success',
      message: 'new orders retrieved',
      data: result,
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}

module.exports = allOrders
