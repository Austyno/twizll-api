const Error = require('../../utils/errorResponse')
const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const createAuthToken = require('../../utils/createAuthToken')

const verifyemail = async (req, res, next) => {
  const { email, otp } = req.body

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

    if (buyer != undefined || buyer != null) {
      user = buyer
    } else if (seller != undefined || seller != null) {
      user = seller
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
