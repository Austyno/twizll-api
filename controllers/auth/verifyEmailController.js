const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const path = require('path')

//TODO:create beautifull ejs pages for error and thank you pages

//this verifys email when a user clicks on the email verification link in email
const verifyEmail = async (req, res, next) => {
  const { code } = req.params

  const user = await User.find({
    $and: [
      { emailVerificationCode: code },
      { emailCodeTimeExpiry: { $gt: Date.now() } },
    ],
  })

  if (!user) {
    //Render ejs page showing error
    res.render(path.join(__dirname, '../../public/views', 'error.ejs'), {
      message: 'the verification code does not exist or has expired',
    })
  }

  try {
    //get user with this code and update db
    const verifyUser = await User.findOne({ emailVerificationCode: code })

    verifyUser.emailVerificationCode = ''
    verifyUser.emailCodeTimeExpiry = ''
    verifyUser.emailVerified = true

    await verifyUser.save()

    //render thank you page after updating db
    const template = path.join(__dirname, '../../public/views', 'thank-you.ejs')
    res.render(template, { message: 'thank you, your email has been verified' })
  } catch (e) {
    return res.render(path.join(__dirname, '../../public/views', 'error.ejs'), {
      message: e.message,
    })
  }
}

module.exports = verifyEmail
