const signJWT = require('./generateToken')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')



const createAuthTokenAndSend = async (user, message, statusCode, res) => {
  const token = signJWT(user._id)

  const refreshToken = uuidv4()

   user.token = token
   user.refreshToken._token = refreshToken
   user.refreshToken.expiryDate = moment().add(3, 'days')

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
    refreshToken,
    data: user,
  })
}

module.exports = createAuthTokenAndSend
