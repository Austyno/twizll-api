const Error = require('../utils/errorResponse')

const authRole = role => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return res.status(403).json({
        status:"forbidden",
        message:'You are not allowed to access this resource',
        data:''
      })
    }
    next()
  }
}

module.exports = authRole
