const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')


const updateBuyerProfile = async (req,res,next) => {
const buyer = req.user
const {fullName,phone} = req.body

if (!buyer) {
  return next(new Error('You need to be logged in to perform this action', 403))
}

try{
  const user = await Buyer.findOneAndUpdate(
    { _id: buyer.id },
    {
      $set: {
        fullName: fullName ? fullName : buyer.fullName,
        phone: phone ? phone : buyer.phone,
      },
    },
    { new: true }
  )
  user.token = undefined
    res.status(200).json({
      status:'success',
      message:'profile update successfully',
      data:user
    })
}catch(e){
 return next(new Error(e.message,500))
}

}
module.exports = updateBuyerProfile