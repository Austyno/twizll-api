const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const crypto = require('crypto')

//display reset form
exports.resetPassWordForm = async (req, res, next) => {
  const { resetCode } = req.params

  const user = await User.find({
    $and: [
      { passwordResetToken: resetCode },
      { passwordResetExpires: { $gt: Date.now() } },
    ],
  })

  if (!user) {
    return res.render('reset-error', {
      message: 'the link your provided either does not exist or has expired',
    })
  }
  const url = `${req.protocol + '://' + req.get('host') + req.originalUrl}`

  res.render('reset-password', { url: url, message: '' })
}

//reset/change the password
exports.resetPassword = async (req, res, next) => {
  const { pass, confirm } = req.body
  const { resetCode } = req.params

  if (!(pass === confirm)) {
    res.render('reset-password', {
      url: '',
      message: 'Your passwords do not match',
    })
  }

  if (pass === confirm) {
    try {
      const user = await User.findOne({ passwordResetToken: resetCode })

      user.passwordResetToken = ''
      user.passwordResetExpires = ''
      user.password = pass

      await user.save()

      res.render('thank-you', {
        message: 'password changed successfully',
      })
    } catch (e) {
      return res.render('error', { message: e.message })
    }
  }
}
