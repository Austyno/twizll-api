const User = require('../../models/userModel')
const crypto = require('crypto')
const Error = require('../../utils/errorResponse')
const generateToken = require('../../utils/generateToken')
const sendMail = require('../../utils/sendMail')
const createAuthToken = require('../../utils/createAuthToken')

const signUp = async (req, res, next) => {
  const { email, phone, password, fullName } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    return next(new Error('A user with this email already exist', 400))
  }

  try {
    const user = await User.create(req.body)

    const verificationCode = crypto.randomBytes(20).toString('hex')
    const codeExpiresIn = Date.now() + 24 * 60 * 60 * 60 - 1000

    user.emailVerificationCode = verificationCode
    user.emailCodeTimeExpiry = codeExpiresIn

    const verificationLink = `${
      req.protocol + '://' + req.get('host') + req.originalUrl
    }/verifyemail/${verificationCode}`
    const token = generateToken(user._id)

    await user.save()

    //send verification mail
    await sendMail.withTemplate(
      { verificationLink, fullName: user.fullName },
      user.email,
      '/verify.ejs',
      'Please verify your email'
    )

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
