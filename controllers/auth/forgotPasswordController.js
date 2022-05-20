const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const generateOtp = require('../../utils/generateOtp')
const moment = require('moment')
const sendMail = require('../../utils/sendMail')

const forgotPass = async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return next(new Error('Please enter an email', 400))
  }

  try {
    let user
    const buyer = await Buyer.findOne({ email })
    const seller = await Seller.findOne({ email })

    if (buyer != null) {
      const otp = generateOtp()
      const mail = sendMail.withTemplate(
        { otp },
        email,
        'otp.ejs',
        'Your verification code'
      )

      if (mail) {
        buyer.passwordResetToken = otp
        buyer.passwordResetExpires = moment().add(1, 'day')
        buyer.save()
        res.status(200).json({
          status: 'success',
          message:
            'We have sent a verification code to your email, copy and past in the provided box',
          data: '',
        })
      }
    } else if (seller != null) {
      const otp = generateOtp()
      const mail = sendMail.withTemplate(
        { otp },
        email,
        'otp.ejs',
        'Your verification code'
      )

      if (mail) {
        seller.passwordResetToken = otp
        seller.passwordResetExpires = moment().add(1, 'day')
        seller.save()

        res.status(200).json({
          status: 'success',
          message:
            'We have sent a verification code to your email, copy and past in the provided box',
          data: '',
        })
      }
    } else {
      return next(new Error(`we could not find ${email} in our records`))
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = forgotPass
