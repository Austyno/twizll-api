const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')
const Order = require('../../models/orderModel')


const confirmOder = (req,res,next) => {
  const seller = req.user
  const sellerStore = req.store

  const {orderId} = req.params

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 403))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }



  try{
    const 
  }catch(e){
    return next(new Error(e.message))
  }

}
module.exports = confirmOder