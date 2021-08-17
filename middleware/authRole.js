const Error = require('../utils/errorResponse')

const authRole = role => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return next(new Error('You are not allowed to access this resource', 403))
    }
    next()
  }
}

module.exports = authRole
