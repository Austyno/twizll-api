const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const generateOtp = require('../../utils/generateOtp')
const moment = require('moment')


const forgotPass = async (req,res,next) =>{
  const {email} = req.body

  if(!email){
    return next(new Error('Please enter a password',400))
  }

  try{
    let user
    const buyer = await Buyer.findOne({email})
    const seller = await Seller.findOne({email})

    if(buyer != null){
      const otp = generateOtp()
      const mail = sendMail.withTemplate(
        { otp },
        email,
        'otp.ejs',
        'Your verification code'
      )

      if(mail){
        buyer.emailVerificationCode = otp
        buyer.passwordResetToken = otp
        buyer.passwordResetExpires = moment().add(1, 'day')

        res.status(200).json({
          status:'success',
          message:'We have sent you a verification code to your email',
          data:''
        })
      }

    }
  }catch(e){
    return next(new Error(e.message,500))
  }
}
module.exports = forgotPass
