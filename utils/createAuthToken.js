const signJWT = require('./generateToken')

const createAuthTokenAndSend = (user, message, statusCode, res) => {
  const token = signJWT(user._id)

  const cookieOptions = {
    expires: new Date(
      // Convert expires time to miliseconds
      Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    code: res.statusCode,
    message,
    data: user,
    token,
  })
}

module.exports = createAuthTokenAndSend
