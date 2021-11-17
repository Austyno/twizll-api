const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')


const getAllOrders = async (req,res,next) =>{
  const buyer = req.user

  if (!buyer) {
    return next(new Error('You need to be logged in to perform this action', 403))
  }

  try{

    const userOrders = await Order.find({buyer:buyer.id})
    res.status(200).json({
      status:'success',
      message:"order retrieved successfully",
      data:userOrders
    })

  }catch(e){
    return next(new Error(e.message, 500))
  }
}

module.exports = getAllOrders