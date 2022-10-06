const Stylist = require('../../models/stylistModel')

const stylistProfile = (req, res, next) => {
  const stylist = req.user

  if (!stylist) {
    return res.status(401).json({
      status: 'failed',
      message: 'Please login',
      data: [],
    })
  }
  try {
    stylist.token = undefined
    stylist.refreshToken = undefined
    return res.status(200).json({
      status: 'success',
      message: 'stylist profile retrieved',
      data: stylist,
    })
  } catch (e) {
    next(e)
  }
}
module.exports = stylistProfile
