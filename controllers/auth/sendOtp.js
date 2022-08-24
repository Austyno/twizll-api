const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const sendMail = require('../../utils/sendMail')
const Stylist = require('../../models/stylistModel')
const generateOtp = require('../../utils/generateOtp')

const sendOTP = async (req, res, next) => {
  const { email } = req.body
  try {
    const buyer = await Buyer.findOne({ email })
    const seller = await Seller.findOne({ email })
    const stylist = await Stylist.findOne({ email })

    if (buyer != null) {
      const otp = generateOtp()
      const mail = sendMail.withTemplate(
        { otp },
        email,
        'otp.ejs',
        'Your verification code'
      )
      if (mail) {
        buyer.emailVerificationCode = otp
        buyer.emailVerified = false
        buyer.save({ validateBeforeSave: false })

        return res.status(200).json({
          status: 'success',
          message: 'verification code sent successfully',
          data: '',
        })
      } else {
        return next(
          'An error occured while sending your verification code, please try again',
          500
        )
      }
    }

    if (seller != null) {
      const otp = generateOtp()
      const mail = sendMail.withTemplate(
        { otp },
        email,
        'otp.ejs',
        'Your verification code'
      )
      if (mail) {
        seller.emailVerificationCode = otp
        seller.emailVerified = false
        seller.save({ validateBeforeSave: false })

        return res.status(200).json({
          status: 'success',
          message: 'verification code sent successfully',
          data: '',
        })
      } else {
        return next(
          'An error occured while sending your verification code, please try again',
          500
        )
      }
    }
    if (stylist != null) {
      const mail = sendMail.withTemplate(
        { otp },
        email,
        'otp.ejs',
        'Your verification code'
      )
      if (mail) {
        stylist.emailVerificationCode = otp
        stylist.emailVerified = false
        stylist.save({ validateBeforeSave: false })

        return res.status(200).json({
          status: 'success',
          message: 'verification code sent successfully',
          data: '',
        })
      } else {
        return next(
          'An error occured while sending your verification code, please try again',
          500
        )
      }
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = sendOTP
