const jwt = require('jsonwebtoken')
const Error = require('../utils/errorResponse')
const User = require('../models/UserModel')

// Protect routes
const authenticated = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token) {
    token = req.cookies.token
  }

  // Make sure token exists
  if (token === null) {
    return next(new Error('You need to sign in', 403))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()
  } catch (e) {
    return next(new Error(e.message, 401))
  }
}
module.exports = authenticated
