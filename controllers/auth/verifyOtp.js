const Error = require('../../utils/errorResponse')
const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Stylist = require('../../models/stylistModel')
const createAuthToken = require('../../utils/createAuthToken')

const verifyemail = async (req, res, next) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return next(new Error('the email and otp are required', 400))
  }

  try {
    let user
    const buyer = Buyer.findOne({
      $and: [{ email: email }, { emailVerificationCode: otp }],
    })
    const seller = Seller.findOne({
      $and: [{ email: email }, { emailVerificationCode: otp }],
    })
    const stylist = Stylist.findOne({
      $and: [{ email: email }, { emailVerificationCode: otp }],
    })

    const get_OTP = await Promise.all([buyer, seller, stylist])

    if (get_OTP[0] != undefined || get_OTP[0] != null) {
      user = buyer
    } else if (get_OTP[1] != undefined || get_OTP[1] != null) {
      user = seller
    } else if (get_OTP[2] != undefined || get_OTP[2] != null) {
      user = stylist
    } else {
      user = null
    }

    if (user == null) {
      return res.status(400).json({
        status: 'failed',
        message: `we could not find a user with ${otp}`,
        data: '',
      })
    }

    user.emailVerified = true
    user.emailVerificationCode = undefined
    user.emailCodeTimeExpiry = undefined

    return createAuthToken(user, 'email verified successfully', 200, res)
  } catch (e) {
    return next(e)
  }
}
module.exports = verifyemail
