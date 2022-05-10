const Buyer = require('../models/buyerModel')
const Seller = require('../models/sellerModel')
const Error = require('../utils/errorResponse')
// const Stylist = require('../models/buyerModel')
const getAuth = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1]
  }
  if (token === null) {
    return next(new Error('You need to sign in', 403))
  }
  try {
    const buyer = await Buyer.findOne({ token }).select('+password')
    const seller = await Seller.findOne({ token }).select('+password')

    if (buyer != null) {
      req.user = buyer
      next()
    } else if (seller != null) {
      req.user = seller
      next()
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }

  next()
}
module.exports = getAuth
