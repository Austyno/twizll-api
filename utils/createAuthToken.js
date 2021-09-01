const signJWT = require('./generateToken')

const createAuthTokenAndSend = async (user, message, statusCode, res) => {
  const token = signJWT(user._id)

   user.token = token

  await user.save()

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  // res.cookie('token', token, cookieOptions)
  user.token = undefined
  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: user,
  })
}

module.exports = createAuthTokenAndSend
