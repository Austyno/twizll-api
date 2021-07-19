const Error = require('../utils/errorResponse')

const authRole = roles => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error('You are not allowed to access this resource', 401))
    }
    next()
  }
}

module.exports = authRole
