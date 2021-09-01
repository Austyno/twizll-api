const User = require('../../models/userModel')

const logOut = async (req, res, next) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })

  const user = req.user

  user.token = undefined
  await user.save()

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  })
}
module.exports = logOut
