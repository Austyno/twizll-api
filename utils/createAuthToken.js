const signJWT = require('./generateToken')

const createAuthTokenAndSend = (user, message, statusCode, res) => {
  const token = signJWT(user._id)

  const cookieOptions = {
    expires: new Date(
      // Convert expires time to miliseconds
      Date.now() + 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('token', token, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    message,
    data: user,
  })
}

module.exports = createAuthTokenAndSend
