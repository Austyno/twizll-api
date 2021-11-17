const OrderItem = require('../../models/orderItem')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const _ = require('lodash')

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
    const products = []

    //get all order items with status new
    const orderItems = await OrderItem.find({})

    //find the product from product collection so we can have access to store that owns product
    for (let i = 0; i < orderItems.length; i++) {
      const getProduct = await Product.findById(orderItems[i].product)
      products.push(getProduct)
    }

    // filter out products that belong to logged in store
    const userProducts = products.filter(item => {
      if(item != null){
       return item.store == sellerStore.id
      }
    })

    let order = []

    //get the logged in store products from order items so we can have access to the order id
    for (let j = 0; j < userProducts.length; j++) {
      const item = await OrderItem.findOne({
        product: userProducts[j].id,
      })
      order.push(item)
    }

    // group by order id
    const result = _(order)
      .groupBy(x => x.orderId)
      .map((value, key) => ({ orderId: key}))
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
