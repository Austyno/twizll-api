const Seller = require('../../models/sellerModel')
const Store = require('../../models/storeModel')
const VerificationDoc = require('../../models/verificationDocsModel')
const createAuthToken = require('../../utils/createAuthToken')

const verifyEmailOtp = async (req, res, next) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res.status(400).json({
      status: 'failed',
      message: 'the email and otp are required',
      data: [],
    })
  }

  try {
    const seller = await Seller.findOne({
      $and: [{ email: email }, { emailVerificationCode: otp }],
    })

    if (seller == null) {
      return res.status(400).json({
        status: 'failed',
        message: `we could not find a user with ${otp}`,
        data: [],
      })
    }

    seller.emailVerified = true
    seller.emailVerificationCode = undefined
    seller.emailCodeTimeExpiry = undefined

    const storeExist = await Store.findOne({ owner: seller._id })
    if (storeExist) {
      const docs = await VerificationDoc.findOne({ store: storeExist._id })
      if (docs) {
        return createAuthToken(
          seller,
          'email verified successfully. registration complete',
          200,
          res
        )
      } else {
        return createAuthToken(
          sellerExist,
          'email verified successfully. Docs required',
          400,
          res,
          'docs required'
        )
      }
    } else {
      return createAuthToken(
        seller,
        'email verified successfully.store required',
        400,
        res,
        'store required'
      )
    }
  } catch (e) {
    return next(e)
  }
}
module.exports = verifyEmailOtp
