const Error = require('../../utils/errorResponse')
const Buyer = require('../../models/buyerModel')


const userProfile = async(req,res,next) => {
  const buyer = req.user

  if (!buyer) {
    return next(
      new Error('You need to be logged in to perform this action', 403)
    )
  }
  buyer.token = undefined
  try{
    res.status(200).json({
      status:"success",
      message:"profile retrieved successfully",
      data: buyer
    })
  }catch(e){
    return next(new Error(e.message,500))
  }
}
module.exports = userProfile