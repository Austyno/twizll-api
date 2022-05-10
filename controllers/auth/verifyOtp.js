const Error = require('../../utils/errorResponse')
const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')

const verifyemail = async (req, res, next) => {
  const { email, otp} = req.body

  if (!email || !otp) {
    return next(new Error('the email and otp are required', 400))
  }

  try {

    let user
    const buyer = await Buyer.findOne({
      $and: [{ email: email }, { emailVerificationCode: otp }],
    })
    const seller = await Seller.findOne({
      $and: [{ email: email }, { emailVerificationCode: otp }],
    })
    // const stylist = await Stylist.findOne({
    //   $and: [{ email: email }, { emailVerificationCode: otp }],
    // })


    if(buyer != undefined || buyer != null){
      user = buyer
    }else if(seller != undefined || seller != null){
      user = seller
    }else{
      user = null
    }

    if(user == null){
      return next(new Error(`user with the otp ${otp} not found`,400))
    }

    user.emailVerified = true
    user.emailVerificationCode = undefined
    user.emailCodeTimeExpiry = undefined
    user.save({validateBeforeSave:false})

    res.status(200).json({
      status:"success",
      message:"email verified successfully",
      data: user
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}
module.exports = verifyemail
