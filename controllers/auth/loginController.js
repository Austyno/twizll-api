const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const generateToken = require('../../utils/generateToken')
const bcrypt = require('bcryptjs')
const createAuthToken = require('../../utils/createAuthToken')


const login = async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new Error('incorrect credentials', 400))
  }
  const verifyPass = bcrypt.compareSync(password, user.password)

  if (!verifyPass) {
    return next(new Error('incorrect credentials', 400))
  }

  try {
    const loggedInUser = await User.findOne({ email })
    const token = generateToken(loggedInUser._id)
    
    return createAuthToken(
      loggedInUser,
      'user logged in successfully',
      200,
      res
    )
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = login
