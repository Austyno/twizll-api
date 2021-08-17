const User = require('../../models/userModel')
const crypto = require('crypto')
const Error = require('../../utils/errorResponse')
const sendMail = require('../../utils/sendMail')
const stripe = require('../../utils/stripe/Stripe')
const createAuthToken = require('../../utils/createAuthToken')
const moment = require('moment')

const signUp = async (req, res, next) => {
  const { email, phone, password, fullName } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    return next(new Error('A user with this email already exist', 400))
  }
  // const session = await User.startSession()
  // session.startTransaction()

  try {
    const user = await User.create(req.body)

    let stripeCustomerId = ''
    let freeTrial = {}

    //get stripe customer id and store for subsequent use and activate 30 days free trial
    if (user.role === 'seller' || user.role === 'stylist') {
      stripeCustomerId = await stripe.addNewCustomer(user.email)
      freeTrial.status = 'active'
      freeTrial.end_date = moment().add(30, 'days')
    }

    //verification code and verification expiration time
    const verificationCode = crypto.randomBytes(20).toString('hex')
    const codeExpiresIn = moment().add(1, 'days')

    user.emailVerificationCode = verificationCode
    user.emailCodeTimeExpiry = codeExpiresIn
    user.stripe_customer_id = stripeCustomerId.id
    user.free_trial = freeTrial

    //create email verification link
    const verificationLink = `${
      req.protocol + '://' + process.env.PROD_ADDRESS + req.originalUrl
    }/verifyemail/${verificationCode}`

    await user.save()

    //send verification mail
    await sendMail.withTemplate(
      { verificationLink, fullName: user.fullName },
      user.email,
      '/verify.ejs',
      'Please verify your email'
    )

    //return token to client
    return createAuthToken(
      user,
      'We have sent you an email. Please click on the link to verify your email',
      200,
      res
    )
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = signUp
