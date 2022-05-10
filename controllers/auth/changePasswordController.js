const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const bcrypt = require('bcryptjs')

const changePassword = (req, res, next) => {
  const user = req.user
  const { oldPassword, newPassword } = req.body

  const passCheck =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/

  if (!newPassword.match(passCheck)) {
    return next(
      new Error(
        'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and a special character',
        400
      )
    )
  }
  try {
    
    const verifyPass = bcrypt.compareSync(oldPassword, user.password)

    if (!verifyPass) {
      return next(new Error('Old password does not match with our records', 400))
    }

    user.password = newPassword
    user.save({ validateBeforeSave: false })

    res.status(200).json({
      status: 'success',
      message: 'password updated successfully',
      data: user,
    })
  } catch (e) {
    return next(e.message, 500)
  }
}
module.exports = changePassword
