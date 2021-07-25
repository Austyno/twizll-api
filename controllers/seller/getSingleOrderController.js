const Order = require('../../models/orderModel')
const OrderItem = require('../../models/orderItemModel')
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

  const order = await Order.find({
    $and: [{ store: sellerStore.id }, { _id: orderId }],
  })


  if(!order){
    return next(new Error('This order does not exist',404))
  }

  try {
    const orderItems = await OrderItem.find({orderId}).populate('product','name')

    res.status(200).json({
      status: 'success',
      message: 'order with order items',
      data: {
        order: order,
        orderitems: orderItems,
      },
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }

  // //get order by store
  // const orderIdExist = await Order.findById({ orderId })

  // if (!orderIdExist) {
  //   return next(new Error('this order does not exist', 404))
  // }

  // try {
  //   const order = await Order.find({
  //     $and: [{ store: sellerStore.id }, { _id: orderId }],
  //   }).populate('orderItems')

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'order retrieved successfully',
  //     data: order,
  //   })
  // } catch (e) {
  //   return next(new Error(e.message, 500))
  // }
}
module.exports = singleOrder
