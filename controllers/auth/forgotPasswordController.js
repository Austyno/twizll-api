const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const crypto = require('crypto')
const sendMail = require('../../utils/sendMail')

const forgotPassword = async (req, res, next) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return next(new Error('we could not find a user with this email', 404))
  }

  const resetToken = crypto.randomBytes(20).toString('hex')
  const tokenExpiresIn = Date.now() + 60 * 60 * 60 - 1000

  const resetLink = `${
    req.protocol + '://' + req.get('host') + req.originalUrl + '/' + resetToken
  }`

  try {
    user.passwordResetToken = resetToken
    user.passwordResetExpires = tokenExpiresIn

    await user.save()
    await sendMail.withTemplate(
      { resetLink, fullName: user.fullName },
      user.email,
      'reset.ejs',
      'Password reset link'
    )

    res.status(200).json({
      status: 'success',
      message:
        'A reset link has been sent to your email. Please click on the link to reset your password',
      data: '',
    })
  } catch (e) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()
    return next(new Error(e.message, 500))
  }
}
module.exports = forgotPassword
